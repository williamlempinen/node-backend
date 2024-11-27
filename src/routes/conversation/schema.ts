import { z } from 'zod'

const Conversation = {
  createConversation: z.object({
    isGroup: z.boolean().optional().default(false),
    participants: z.array(z.string().min(1)),
    groupName: z.string().min(1).optional()
  }),
  getConversation: z.object({
    userId: z.string().min(1),
    pageNumber: z.string().min(1).optional()
  })
}

export default Conversation