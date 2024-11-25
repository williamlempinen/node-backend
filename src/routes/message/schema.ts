import { z } from 'zod'

const Message = {
  createMessage: z.object({
    content: z.string().min(1),
    senderId: z.string().min(1),
    conversationId: z.string().min(1)
  }),
  getMessage: z.object({
    conversationId: z.string().min(1),
    pageNumber: z.string().min(1)
  }),
  full: z.object({
    content: z.string().min(1),
    sender_id: z.number().min(1),
    conversation_id: z.number().min(1),
    id: z.number().min(1),
    created_at: z.string().min(1),
    is_seen: z.boolean()
  })
}

export default Message
