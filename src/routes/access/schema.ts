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
  }),
  logout: z.object({
    id: z.number()
  }),
  refreshToken: z.object({
    email: z.string().email('Invalid email'),
    id: z.number().min(1),
    refreshToken: z.string().min(1, 'Refresh token is required')
  })
}

export type UserLogin = z.infer<typeof Access.login>
