import { prismaClient as prisma } from '..'
import { User, Prisma as P } from '@prisma/client'
import Logger from '../../core/Logger'
import { UserDTO } from '../models/UserDTOs'
import { checkPasswordHash, createTokens, hashPassword } from '../../auth/authUtils'
import { UserLogin } from '../../routes/access/schema'
import { RepoResponse } from 'types'

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

  async findAll(): Promise<RepoResponse<UserDTO[]>> {
    try {
      const allUsers: User[] = await prisma.user.findMany()
      const userDTOs: UserDTO[] = allUsers.map((user) => UserRepo.userToDTO(user)).filter((userDTO) => userDTO !== null)

      return {
        success: true,
        data: { ...userDTOs }
      }
    } catch (error: any) {
      Logger.error(`Error occured while finding all users: ${error}`)
      return { errorMessage: 'Could not find all users' }
    }
  },

  async registerUser(
    data: P.UserCreateInput
  ): Promise<RepoResponse<{ user: UserDTO; accessToken: string; refreshToken: string }>> {
    try {
      const exists = await UserRepo.findByEmail(data.email)
      if (exists) return { errorMessage: 'User alredy exists' }

      const hashedPassword = hashPassword(data.password)

      const user = await prisma.user.create({ data: { ...data, password: hashedPassword } })

      if (!user) return { errorMessage: 'Could not create user' }

      const userDTO = UserRepo.userToDTO(user)

      const { accessToken, refreshToken } = await createTokens(userDTO)

      return { success: true, data: { user: userDTO, accessToken, refreshToken } }
    } catch (error: any) {
      Logger.error(`Error registering new user: ${error}`)
      return { errorMessage: 'Could not register user' }
    }
  },

  async login(data: UserLogin): Promise<RepoResponse<{ user: UserDTO; accessToken: string; refreshToken: string }>> {
    try {
      const user = await UserRepo.findByEmail(data.email)

      if (!user) {
        Logger.info(`No user found with email: ${data.email}`)
        return { errorMessage: `No user found with the email: ${data.email}` }
      }

      const isPasswordCorrect = checkPasswordHash(data.password, user.password)

      if (!isPasswordCorrect) {
        Logger.error('Password incorrect')
        return { errorMessage: 'Password incorrect' }
      }

      const userDTO = UserRepo.userToDTO(user)

      const { accessToken, refreshToken } = await createTokens(userDTO)

      return { success: true, data: { user: userDTO, accessToken, refreshToken } }
    } catch (error: any) {
      Logger.error(`Error login in user: ${error}`)
      return { errorMessage: `Internal server error ${error}` }
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
