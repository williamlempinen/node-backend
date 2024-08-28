import { prismaClient as prisma } from '..'
import { User, Prisma as P } from '@prisma/client'
import Logger from '../../core/Logger'
import { UserDTO } from '../models/UserDTOs'

const UserRepo = {
  async findAll(): Promise<User[] | null> {
    try {
      return await prisma.user.findMany()
    } catch (error: any) {
      Logger.error(`Error occured while finding all users: ${error}`)
      return null
    }
  },

  async registerUser(data: P.UserCreateInput): Promise<UserDTO | null> {
    try {
      return await prisma.user.create({ data })
    } catch (error: any) {
      Logger.error(`Error creating registering new user: ${error}`)
      return null
    }
  }
}

export default UserRepo
