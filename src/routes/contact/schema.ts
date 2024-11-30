import { z } from 'zod'

const Contact = {
  pairContact: z.object({
    userId: z.string().min(1),
    contactId: z.string().min(1)
  })
}

export default Contact
