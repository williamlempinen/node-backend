import bcrypt from 'bcrypt'
import crypto, { randomBytes } from 'crypto'
import { createJwtToken } from './JWT'
import RefreshTokenRepo from '../database/repository/RefreshTokenRepo'
import { UserDTO } from '../database/models/UserDTOs'
import { prismaClient as prisma } from '../database'
import Logger from '../core/Logger'
import { AuthFailureResponse } from '../core/responses'

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
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

  // error handled in UserRepo
  await RefreshTokenRepo.create({
    user: { connect: { id: userDTO.id } },
    token_hash: refreshToken,
    expires_at: expiresAt
  })

  return { accessToken, refreshToken }
}

export const deleteExpiredRefreshTokens = async () => {
  try {
    const now = new Date()
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expires_at: {
          lt: now
        }
      }
    })

    Logger.info('Running checks')

    if (result.count > 0) {
      Logger.info(`Deleted ${result.count} expired refresh tokens.`)
    }
  } catch (error: any) {
    Logger.error(`Failed to delete expired refresh tokens: ${error.message}`)
  }
}

export const generateSessionId = (): string => {
  return randomBytes(16).toString('hex')
}

export const getAccessToken = (authorization?: string): string => {
  if (!authorization) return ''
  if (!authorization.startsWith('Bearer ')) return ''
  return authorization.split(' ')[1]
}
