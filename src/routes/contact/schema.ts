import { z } from 'zod'

const Contact = {
  createContact: z.object({
    userId: z.number().min(1),
    contactId: z.number().min(1)
  })
}

export default Contact
