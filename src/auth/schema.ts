import { z } from 'zod'

export const Auth = {
  req: z
    .object({
      authorization: z.string().regex(/^Bearer\s[\w-]*\.[\w-]*\.[\w-]*$/, 'Invalid Authorization header format')
    })
    .passthrough()
}
