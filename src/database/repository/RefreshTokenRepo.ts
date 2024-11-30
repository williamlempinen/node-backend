import { prismaClient as prisma } from '..'
import { RefreshToken, Prisma as P } from '@prisma/client'
import Logger from '../../core/Logger'
import { RepoResponse } from 'types'
import { ErrorType } from '../../core/errors'
import { HOUR_NUM } from '../../constants'

const RefreshTokenRepo = {
  async create(userId: number, refreshToken: string): Promise<RepoResponse<RefreshToken>> {
    try {
      const existingToken = await prisma.refreshToken.findFirst({
        where: {
          user_id: userId
        }
      })

      if (existingToken) {
        const [isDeleted, error] = await RefreshTokenRepo.deleteByUserId(userId)
        if (error) {
          Logger.error('Error deleting existing user refreshtoken')
          return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
        }
        Logger.info('Old existing refreshtoken deleted')
      }

      const token = await prisma.refreshToken.create({
        data: {
          user: { connect: { id: userId } },
          token_hash: refreshToken,
          expires_at: new Date(Date.now() + HOUR_NUM)
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

  async deleteByUserId(userId: number): Promise<RepoResponse<boolean>> {
    try {
      await prisma.refreshToken.deleteMany({
        where: {
          user_id: userId
        }
      })

      return [true, null]
    } catch (error: any) {
      Logger.error(`Error deleting refresh token: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'internal server error' }]
    }
  }
}

export default RefreshTokenRepo
