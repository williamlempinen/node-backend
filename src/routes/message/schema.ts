import { z } from 'zod'

const Message = {
  createMessage: z.object({
    content: z.string().min(1),
    senderId: z.string().min(1),
    conversationId: z.string().min(1)
  })
}

export default Message
