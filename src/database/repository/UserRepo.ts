import { prismaClient as prisma } from '..'
import { User, Prisma as P, Contact } from '@prisma/client'
import Logger from '../../core/Logger'
import { UserDTO } from '../models/UserDTO'
import { checkPasswordHash, createTokens, generateSessionId, hashPassword } from '../../auth/authUtils'
import { UserLogin } from '../../routes/access/schema'
import { Paginated, PaginatedSearchQuery, RepoResponse } from 'types'
import { ErrorType } from '../../core/errors'
import RefreshTokenRepo from './RefreshTokenRepo'
import { redisGet, redisSet } from '../../cache/repository'
import { HOUR_NUM } from '../../constants'

const UserRepo = {
  // USE ONLY IN THIS SCOPE
  async findByEmail(email: string): Promise<(User & { contacts: Contact[] }) | null> {
    try {
      const user = await prisma.user.findFirst({ where: { email: email }, include: { contacts: true } })
      if (!user) return null

      return user
    } catch (error: any) {
      Logger.error(`Error finding user: ${error}`)
      return null
    }
  },

  async findById(id: number): Promise<RepoResponse<UserDTO>> {
    try {
      const user = await prisma.user.findUnique({ where: { id: id }, include: { contacts: true } })
      if (!user) return [null, { type: ErrorType.NOT_FOUND, errorMessage: `No user found with id: ${id}` }]

      const userDTO = UserRepo.userToDTO(user, user.contacts)
      return [userDTO, null]
    } catch (error: any) {
      Logger.error(`Error finding user by id: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  // this is testing
  //async findAll(): Promise<RepoResponse<UserDTO[]>> {
  //  try {
  //    const allUsers = await prisma.user.findMany({ include: { contacts: true } })
  //    const userDTOs: UserDTO[] = allUsers
  //      .map((user) => UserRepo.userToDTO(user, user.contact))
  //      .filter((userDTO) => userDTO !== null)
  //
  //    return [[], null]
  //  } catch (error: any) {
  //    Logger.error(`Error occured while finding all users: ${error}`)
  //    return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
  //  }
  //},

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

      const userDTO = UserRepo.userToDTO(user, [])

      const { accessToken, refreshToken } = await createTokens(userDTO)
      if (!accessToken || !refreshToken)
        return [null, { type: ErrorType.INTERNAL, errorMessage: 'Could not create tokens' }]

      return [{ user: userDTO, accessToken, refreshToken }, null]
    } catch (error: any) {
      Logger.error(`Error registering new user: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async login(
    data: UserLogin
  ): Promise<RepoResponse<{ user: UserDTO; accessToken: string; refreshToken: string; sessionId: string }>> {
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

      const userDTO = UserRepo.userToDTO(user, user.contacts)

      // DO NOT HANDLE THE ERROR
      const [existingRefreshToken, error] = await RefreshTokenRepo.findByUserId(userDTO.id)

      if (existingRefreshToken) {
        Logger.info(`Found existing refresh token: ${existingRefreshToken.token_hash}`)
        await RefreshTokenRepo.deleteByUserId(userDTO.id)
      }

      const { accessToken, refreshToken } = await createTokens(userDTO)
      const sessionId = generateSessionId()

      if (!accessToken || !refreshToken)
        return [null, { type: ErrorType.INTERNAL, errorMessage: 'Could not create tokens' }]

      const setStatus = await UserRepo.updateUserIsActive(userDTO.id, true)
      if (!setStatus) {
        Logger.error('Error updating user status')
        return [null, { type: ErrorType.INTERNAL, errorMessage: 'Could not update user status' }]
      }

      await redisSet(sessionId, JSON.stringify({ accessToken, refreshToken }), HOUR_NUM)

      return [{ user: userDTO, accessToken, refreshToken, sessionId }, null]
    } catch (error: any) {
      Logger.error(`Error login in user: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  // this is not used
  async logout(userId: number): Promise<RepoResponse<boolean>> {
    try {
      Logger.info('LOGGING USER OUT')
      const userLogout = await prisma.user.update({
        where: {
          id: userId,
          is_active: true
        },
        data: {
          is_active: false
        }
      })
      if (!userLogout) return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]

      return [true, null]
    } catch (error: any) {
      Logger.error(`Error logout on user`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async updateUserIsActive(userId: number, isActive: boolean): Promise<boolean | null> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { is_active: isActive }
      })

      Logger.info('User active status updated')
      return true
    } catch (error: any) {
      Logger.error(`Error updating user active status, user id: ${userId}`)
      return null
    }
  },

  async findAllActiveUsers(): Promise<RepoResponse<UserDTO[]>> {
    try {
      const activeUsers = await prisma.user.findMany({ where: { is_active: true }, include: { contacts: true } })
      if (!activeUsers) return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]

      const userDTOs: UserDTO[] = activeUsers
        .map((user) => UserRepo.userToDTO(user, user.contacts))
        .filter((userDTO) => userDTO !== null)

      return [userDTOs, null]
    } catch (error: any) {
      Logger.error(`Error finding active users: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async searchUsers({
    searchQuery,
    page = 1,
    limit = 10
  }: PaginatedSearchQuery): Promise<RepoResponse<Paginated<UserDTO>>> {
    try {
      const skip = (page - 1) * limit
      const whereClause: P.UserWhereInput = {
        username: { contains: searchQuery, mode: 'insensitive' }
      }

      const totalCount = await prisma.user.count({ where: whereClause })
      const users = await prisma.user.findMany({
        where: whereClause,
        skip: skip,
        take: limit
      })

      if (!users || !totalCount) {
        Logger.error('No users found')
        return [{ data: [], page: 1, limit: 10, totalCount: 0, totalPages: 0, hasNextPage: false }, null]
      }

      // contacts are returned as an empty list
      const userDTOs: UserDTO[] = users
        .map((user) => UserRepo.userToDTO(user, []))
        .filter((userDTO) => userDTO !== null)

      const totalPages = Math.ceil(totalCount / limit)
      const hasNextPage = page < totalPages

      return [{ data: userDTOs, page, limit, totalCount, totalPages, hasNextPage }, null]
    } catch (error: any) {
      Logger.error(`Error searching users: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  userToDTO(data: User, contacts: Contact[]): UserDTO {
    const userDTO: UserDTO = {
      id: data.id,
      username: data.username,
      email: data.email,
      is_active: data.is_active,
      created_at: data.created_at,
      role: data.role,
      profile_picture_url: data.profile_picture_url,
      contacts: contacts || []
    }

    return userDTO
  }
}

export default UserRepo
