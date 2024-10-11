import { Paginated, PaginatedSearchQuery, RepoResponse } from 'types'
import { prismaClient as prisma } from '..'
import { Conversation, Prisma as P } from '@prisma/client'
import Logger from '../../core/Logger'
import { ErrorType } from '../../core/errors'
import { ConversationDTO } from '../models/ConversationDTO'

type CreateConversationType = {
  isGroup?: boolean
  participants: string[]
}

const ConversationRepo = {
  async createConversation(data: CreateConversationType): Promise<RepoResponse<ConversationDTO>> {
    try {
      Logger.info(`Received data in repo: ${JSON.stringify(data)}`)

      const createdConversation = await prisma.conversation.create({
        data: {
          is_group: data.isGroup ?? false,
          participants: {
            connect: data.participants.map((pId) => ({
              id: parseInt(pId)
            }))
          }
        }
      })
      if (!createdConversation)
        return [null, { type: ErrorType.INTERNAL, errorMessage: 'Could not create new conversation' }]

      Logger.info(`Created conversation in repo: ${JSON.stringify(createdConversation)}`)

      return [createdConversation, null]
    } catch (error: any) {
      Logger.error(`Error occurred: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async deleteConversation(id: number): Promise<RepoResponse<boolean>> {
    try {
      const isConversationDeleted = await prisma.conversation.delete({
        where: {
          id: id
        }
      })
      if (!isConversationDeleted)
        return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Could not delete conversation' }]

      return [true, null]
    } catch (error: any) {
      Logger.error(`Error deleting conversation: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async getConversations({
    page = 1,
    limit = 10
  }: PaginatedSearchQuery): Promise<RepoResponse<Paginated<ConversationDTO>>> {
    try {
      const skip = (page - 1) * limit

      const totalCount = await prisma.conversation.count()
      const conversations = await prisma.conversation.findMany({
        skip: skip,
        take: limit
      })

      if (!totalCount || !conversations) {
        Logger.error(`Error getting conversations`)
        return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Error finding conversations' }]
      }

      return [{ data: conversations, page, limit, totalCount }, null]
    } catch (error: any) {
      Logger.error(`Error finding conversations: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  }
}

export default ConversationRepo
