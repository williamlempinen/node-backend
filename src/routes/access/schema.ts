import { z } from 'zod'

export const Access = {
  signup: z.object({
    username: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters long')
  }),
  login: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters long')
  })
}

export type UserLogin = z.infer<typeof Access.login>
