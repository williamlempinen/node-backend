import bcrypt from 'bcrypt'
import crypto, { randomBytes } from 'crypto'
import { createJwtToken } from './JWT'
import RefreshTokenRepo from '../database/repository/RefreshTokenRepo'
import { UserDTO } from '../database/models/UserDTO'
import { prismaClient as prisma } from '../database'
import Logger from '../core/Logger'

type Tokens = {
  accessToken: string
  refreshToken: string
}

export const hashPassword = (password: string): string => {
  const rounds = 10
  const s = bcrypt.genSaltSync(rounds)
  return bcrypt.hashSync(password, s)
}

export const checkPasswordHash = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash)
}

export const createTokens = async (userDTO: UserDTO): Promise<Tokens> => {
  const accessToken = createJwtToken(userDTO, '1h')

  const refreshToken = crypto.randomBytes(64).toString('hex')

  // error handled in repos
  await RefreshTokenRepo.create(userDTO.id, refreshToken)

  return { accessToken, refreshToken }
}

export const deleteExpiredRefreshTokens = async () => {
  try {
    const now = new Date()
    Logger.info('Running checks')

    const expiredTokens = await prisma.refreshToken.findMany({
      where: {
        expires_at: {
          lt: now
        }
      },
      select: {
        user_id: true
      }
    })

    if (expiredTokens.length === 0) {
      Logger.info('No expired refresh tokens found.')
      return
    }

    const userIds = Array.from(new Set(expiredTokens.map((token) => token.user_id)))

    const inactiveUsersWithExpiredTokens = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        },
        is_active: false
      },
      select: {
        id: true
      }
    })

    const inactiveUserIds = inactiveUsersWithExpiredTokens.map((user) => user.id)

    if (inactiveUserIds.length === 0) {
      Logger.info('No inactive users found with expired refresh tokens.')
      return
    }

    const deleteResult = await prisma.refreshToken.deleteMany({
      where: {
        user_id: {
          in: inactiveUserIds
        }
      }
    })

    if (deleteResult.count > 0) {
      Logger.info(`Updated ${userIds.length} users' and deleted ${deleteResult.count} expired refresh tokens.`)
    }
  } catch (error: any) {
    Logger.error(`Failed to delete expired refresh tokens: ${error.message}`)
  }
}

// TODO: implement sessions for client
export const generateSessionId = (): string => {
  return randomBytes(16).toString('hex')
}

export const getAccessToken = (authorization?: string): string => {
  if (!authorization) return ''
  if (!authorization.startsWith('Bearer ')) return ''
  return authorization.split(' ')[1]
}
