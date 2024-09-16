import { prismaClient as prisma } from '..'
import { User, Prisma as P } from '@prisma/client'
import Logger from '../../core/Logger'
import { UserDTO } from '../models/UserDTOs'
import { checkPasswordHash, createTokens, hashPassword } from '../../auth/authUtils'
import { UserLogin } from '../../routes/access/schema'
import { RepoResponse } from 'types'
import { ErrorType } from '../../core/errors'
import RefreshTokenRepo from './RefreshTokenRepo'

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

  async findById(id: number): Promise<RepoResponse<UserDTO>> {
    try {
      const user = await prisma.user.findUnique({ where: { id: id } })
      if (!user) return [null, { type: ErrorType.NOT_FOUND, errorMessage: `No user found with id: ${id}` }]

      const userDTO = UserRepo.userToDTO(user)
      return [userDTO, null]
    } catch (error: any) {
      Logger.error(`Error finding user by id: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async findAll(): Promise<RepoResponse<UserDTO[]>> {
    try {
      const allUsers: User[] = await prisma.user.findMany()
      const userDTOs: UserDTO[] = allUsers.map((user) => UserRepo.userToDTO(user)).filter((userDTO) => userDTO !== null)

      return [{ ...userDTOs }, null]
    } catch (error: any) {
      Logger.error(`Error occured while finding all users: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async registerUser(
    data: P.UserCreateInput
  ): Promise<RepoResponse<{ user: UserDTO; accessToken: string; refreshToken: string }>> {
    try {
      const exists = await UserRepo.findByEmail(data.email)
      if (exists)
        return [null, { type: ErrorType.NOT_FOUND, errorMessage: `User with email: ${data.email} already exists` }]

      const hashedPassword = hashPassword(data.password)

      const user = await prisma.user.create({ data: { ...data, password: hashedPassword } })
      if (!user) return [null, { type: ErrorType.INTERNAL, errorMessage: 'Could not create new user' }]

      const userDTO = UserRepo.userToDTO(user)

      const { accessToken, refreshToken } = await createTokens(userDTO)
      if (!accessToken || !refreshToken)
        return [null, { type: ErrorType.INTERNAL, errorMessage: 'Could not create tokens' }]

      return [{ user: userDTO, accessToken, refreshToken }, null]
    } catch (error: any) {
      Logger.error(`Error registering new user: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async login(data: UserLogin): Promise<RepoResponse<{ user: UserDTO; accessToken: string; refreshToken: string }>> {
    try {
      const user = await UserRepo.findByEmail(data.email)
      if (!user) {
        Logger.error(`No user found with email: ${data.email}`)
        return [null, { type: ErrorType.NOT_FOUND, errorMessage: `No user found with email ${data.email}` }]
      }

      const isPasswordCorrect = checkPasswordHash(data.password, user.password)
      if (!isPasswordCorrect) {
        Logger.error('Password incorrect')
        return [null, { type: ErrorType.UNAUTHORIZED, errorMessage: 'Password incorrect' }]
      }

      const userDTO = UserRepo.userToDTO(user)

      const [existingRefreshToken, error] = await RefreshTokenRepo.findByUserId(userDTO.id)
      if (error) return [null, { type: error.type, errorMessage: error.errorMessage }]

      if (existingRefreshToken) {
        Logger.info(`Found existing refresh token: ${existingRefreshToken.token_hash}`)
        await RefreshTokenRepo.deleteByUserId(userDTO.id)
      }

      const { accessToken, refreshToken } = await createTokens(userDTO)
      if (!accessToken || !refreshToken)
        return [null, { type: ErrorType.INTERNAL, errorMessage: 'Could not create tokens' }]

      return [{ user: userDTO, accessToken, refreshToken }, null]
    } catch (error: any) {
      Logger.error(`Error login in user: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
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
