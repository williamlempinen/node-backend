import { User } from '@prisma/client'

export type UserDTO = Omit<User, 'password' | 'role' | 'updated_at'>
