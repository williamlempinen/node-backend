import { z } from 'zod'

export const Auth = {
  authenticate: z
    .object({
      authorization: z.string().regex(/^Bearer\s[\w-]*\.[\w-]*\.[\w-]*$/, 'Invalid Authorization header format')
    })
    .passthrough(),
  validate: z.object({
    sessionId: z.string().min(1)
  })
}
