import { Paginated, PaginatedSearchQuery, RepoResponse } from 'types'
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
  },

  async getMessages(
    conversationId: number,
    { page = 1, limit = 30 }: PaginatedSearchQuery
  ): Promise<RepoResponse<Paginated<MessageDTO>>> {
    try {
      const skip = (page - 1) * limit

      const totalCount = await prisma.message.count({
        where: {
          conversation_id: conversationId
        },
        skip: skip,
        take: limit
      })

      Logger.info('TOTAL COUNT OF MESSAGES: ', totalCount)

      if (totalCount === 0)
        return [{ data: [], page: 1, limit: 10, totalCount: 0, totalPages: 0, hasNextPage: false }, null]

      const messages = await prisma.message.findMany({
        where: {
          conversation_id: conversationId
        }
      })
      if (!messages || !totalCount)
        return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Could not find messages' }]

      const totalPages = Math.ceil(totalCount / limit)
      const hasNextPage = page < totalPages

      return [{ data: messages, page, limit, totalCount, totalPages, hasNextPage }, null]
    } catch (error: any) {
      Logger.error(`Error getting messages: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  }
}

export default MessageRepo
