import { RepoResponse } from 'types'
import Logger from '../../core/Logger'
import { ErrorType } from '../../core/errors'
import { prismaClient as prisma } from '..'
import { MessageDTO } from '../models/MessageDTO'

type MessageDataType = {
  content: string
  senderId: string
  conversationId: string
}

const MessageRepo = {
  async createMessage(data: MessageDataType): Promise<RepoResponse<MessageDTO>> {
    try {
      const message = await prisma.message.create({
        data: {
          is_seen: false,
          sender_id: parseInt(data.senderId),
          conversation_id: parseInt(data.conversationId),
          content: data.content
        }
      })
      if (!message) return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Could not create message' }]

      return [message, null]
    } catch (error: any) {
      Logger.error(`Error creating message: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  }
}

export default MessageRepo
