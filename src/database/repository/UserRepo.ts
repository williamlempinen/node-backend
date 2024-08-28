import { prismaClient as prisma } from '..'
import { User, Prisma as P } from '@prisma/client'
import Logger from '../../core/Logger'
import { UserDTO } from '../models/UserDTOs'
import { createToken } from '../../auth/JWT'
import crypto from 'crypto'
import RefreshTokenRepo from './RefreshTokenRepo'

const UserRepo = {
  async findByEmail(email: string): Promise<UserDTO | null> {
    try {
      const user = await prisma.user.findFirst({ where: { email: email } })
      if (!user) return null

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        is_active: user.is_active,
        created_at: user.created_at,
        profile_picture_url: user.profile_picture_url
      }
    } catch (error: any) {
      Logger.error(`Error finding user: ${error}`)
      return null
    }
  },

  async findAll(): Promise<User[] | null> {
    try {
      return await prisma.user.findMany()
    } catch (error: any) {
      Logger.error(`Error occured while finding all users: ${error}`)
      return null
    }
  },

  async registerUser(
    data: P.UserCreateInput
  ): Promise<{ user: UserDTO; accessToken: string; refreshToken: string } | null> {
    try {
      const exists = await UserRepo.findByEmail(data.email)
      if (exists) return null

      const user = await prisma.user.create({ data })

      const userDTO: UserDTO = {
        id: user.id,
        username: user.username,
        email: user.email,
        is_active: user.is_active,
        created_at: user.created_at,
        profile_picture_url: user.profile_picture_url
      }

      const accessToken = createToken(userDTO, '1h')
      const refreshToken = crypto.randomBytes(64).toString('hex')
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

      await RefreshTokenRepo.create({
        user: { connect: { id: userDTO.id } },
        token_hash: refreshToken,
        expires_at: expiresAt
      })

      return { user: userDTO, accessToken, refreshToken }
    } catch (error: any) {
      Logger.error(`Error creating registering new user: ${error}`)
      return null
    }
  }
}

export default UserRepo
