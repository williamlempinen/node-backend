import { prismaClient as prisma } from '..'
import { RefreshToken, Prisma as P } from '@prisma/client'
import Logger from '../../core/Logger'

const RefreshTokenRepo = {
  async create(data: P.RefreshTokenCreateInput): Promise<RefreshToken | null> {
    try {
      const refreshToken = await prisma.refreshToken.create({ data })
      return refreshToken
    } catch (error: any) {
      Logger.error(`Error creating refresh token: ${error}`)
      return null
    }
  },

  async findByUserId(userId: number): Promise<RefreshToken | null> {
    try {
      const refreshToken = await prisma.refreshToken.findFirst({ where: { user_id: userId } })

      if (!refreshToken) {
        return null
      }

      return refreshToken
    } catch (error: any) {
      Logger.error(`Error finding refresh token: ${error}`)
      return null
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
