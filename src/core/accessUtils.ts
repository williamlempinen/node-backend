import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { createJwtToken } from '../auth/JWT'
import RefreshTokenRepo from '../database/repository/RefreshTokenRepo'
import { UserDTO } from '../database/models/UserDTOs'
import { prismaClient as prisma } from '../database'
import Logger from './Logger'

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

setInterval(deleteExpiredRefreshTokens, 60 * 60 * 100)
