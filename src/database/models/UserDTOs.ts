import { User } from '@prisma/client'

export type UserDTO = Omit<User, 'password_hash' | 'role' | 'updated_at'>
