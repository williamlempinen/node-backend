import { z } from 'zod'

export const Auth = {
  authenticate: z
    .object({
      authorization: z.string().regex(/^Bearer\s[\w-]*\.[\w-]*\.[\w-]*$/, 'Invalid Authorization header format')
    })
    .passthrough(),
  validate: z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1)
  })
}
