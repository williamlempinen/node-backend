import prismaClient from '..'
import { User } from '@prisma/client'
import Logger from '../../core/Logger'

type CreateUserType = Omit<User, 'id' | 'created_at' | 'updated_at'>

export class UserRepo {
  static async findAll(): Promise<User[] | null> {
    try {
      const allUsers = prismaClient.user.findMany()

      Logger.info('Finding all users')
      return allUsers
    } catch (error: any) {
      Logger.error(`Error finding all users: ${error}`)
      return null
    }
  }

  static async registerUser(data: CreateUserType): Promise<User | null> {
    try {
      const newUser = await prismaClient.user.create({
        data
      })

      Logger.info(`New user registered with username: ${newUser.username}`)
      return newUser
    } catch (error: any) {
      Logger.error(`Error registering new user: ${error.message}`)
      return null
    }
  }
}
