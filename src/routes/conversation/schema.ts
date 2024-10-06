import { z } from 'zod'

const Conversation = {
  createConversation: z.object({
    isGroup: z.boolean().optional().default(false),
    participants: z.array(z.string().min(1))
  })
}

export default Conversation
