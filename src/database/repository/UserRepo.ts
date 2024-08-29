import { prismaClient as prisma } from '..'
import { User, Prisma as P } from '@prisma/client'
import Logger from '../../core/Logger'
import { UserDTO } from '../models/UserDTOs'
import { checkPasswordHash, createTokens, hashPassword } from '../../core/accessUtils'
import Access from '../../routes/access/schema'
import { z } from 'zod'

type UserLogin = z.infer<typeof Access.login>

const UserRepo = {
  // USE ONLY IN THIS SCOPE
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findFirst({ where: { email: email } })
      if (!user) return null

      return user
    } catch (error: any) {
      Logger.error(`Error finding user: ${error}`)
      return null
    }
  },

  async findAll(): Promise<UserDTO[] | null> {
    try {
      const allUsers: User[] = await prisma.user.findMany()
      const userDTOs: UserDTO[] = allUsers.map((user) => UserRepo.userToDTO(user)).filter((userDTO) => userDTO !== null)

      return userDTOs
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

      const hashedPassword = hashPassword(data.password)

      const user = await prisma.user.create({ data: { ...data, password: hashedPassword } })

      const userDTO = UserRepo.userToDTO(user)

      const { accessToken, refreshToken } = await createTokens(userDTO)

      return { user: userDTO, accessToken, refreshToken }
    } catch (error: any) {
      Logger.error(`Error registering new user: ${error}`)
      return null
    }
  },

  async login(data: UserLogin): Promise<{ user: UserDTO; accessToken: string; refreshToken: string } | null> {
    try {
      const user = await UserRepo.findByEmail(data.email)

      if (!user) {
        Logger.info(`No user found with email: ${data.email}`)
        return null
      }

      const isPasswordCorrect = checkPasswordHash(data.password, user.password)

      if (!isPasswordCorrect) {
        Logger.error('Password incorrect')
        return null
      }

      const userDTO = UserRepo.userToDTO(user)

      const { accessToken, refreshToken } = await createTokens(userDTO)

      return { user: userDTO, accessToken, refreshToken }
    } catch (error: any) {
      Logger.error(`Error login in user: ${error}`)
      return null
    }
  },

  userToDTO(data: User): UserDTO {
    const userDTO: UserDTO = {
      id: data.id,
      username: data.username,
      email: data.email,
      is_active: data.is_active,
      created_at: data.created_at,
      role: data.role,
      profile_picture_url: data.profile_picture_url
    }

    return userDTO
  }
}

export default UserRepo
