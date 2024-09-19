import { prismaClient as prisma } from '..'
import { RefreshToken, Prisma as P } from '@prisma/client'
import Logger from '../../core/Logger'
import { RepoResponse } from 'types'
import { ErrorType } from '../../core/errors'

const RefreshTokenRepo = {
  async create(userId: number, refreshToken: string): Promise<RepoResponse<RefreshToken>> {
    try {
      const existingToken = await prisma.refreshToken.findFirst({
        where: {
          user_id: userId
        }
      })
      if (existingToken) await RefreshTokenRepo.deleteByUserId(userId)

      const token = await prisma.refreshToken.create({
        data: {
          user: { connect: { id: userId } },
          token_hash: refreshToken,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      })
      if (!token) return [null, { type: ErrorType.INTERNAL, errorMessage: 'Error creating new refresh token' }]

      return [token, null]
    } catch (error: any) {
      Logger.error(`Error creating refresh token: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async findByUserId(userId: number): Promise<RepoResponse<RefreshToken>> {
    try {
      const refreshToken = await prisma.refreshToken.findFirst({ where: { user_id: userId } })
      if (!refreshToken)
        return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'No refresh tokens with this user id' }]

      return [refreshToken, null]
    } catch (error: any) {
      Logger.error(`Error finding refresh token: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async deleteByUserId(userId: number): Promise<boolean> {
    try {
      await prisma.refreshToken.deleteMany({
        where: {
          user_id: userId
        }
      })

      return true
    } catch (error: any) {
      Logger.error(`Error deleting refresh token: ${error}`)
      return false
    }
  }
}

export default RefreshTokenRepo
