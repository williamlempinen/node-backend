import { User, Contact } from '@prisma/client'

export type UserDTO = Omit<User, 'password' | 'updated_at'> & { contacts: Contact[] }
