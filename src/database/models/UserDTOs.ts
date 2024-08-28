import { User } from '@prisma/client'

export type UserDTO = Omit<User, 'id' | 'password_hash' | 'role' | 'updated_at'>
