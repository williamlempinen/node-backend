import { Paginated, PaginatedSearchQuery, RepoResponse } from 'types'
import { prismaClient as prisma } from '..'
import { Conversation, Prisma as P } from '@prisma/client'
import Logger from '../../core/Logger'
import { ErrorType } from '../../core/errors'
import { ConversationDTO } from '../models/ConversationDTO'
import UserRepo from './UserRepo'

type CreateConversationType = {
  isGroup?: boolean
  participants: string[]
  groupName?: string
}

const ConversationRepo = {
  async createConversation(data: CreateConversationType): Promise<RepoResponse<ConversationDTO>> {
    try {
      Logger.info(`Received data in repo: ${JSON.stringify(data)}`)

      let groupName = ''

      if (!data.isGroup) {
        Logger.info('Conversation is not group')

        if (data.participants.length > 2) {
          Logger.error('Conversation is not group and too many participants added')

          return [
            null,
            { type: ErrorType.BAD_REQUEST, errorMessage: 'Private conversations can only have two participants' }
          ]
        }

        const [p1, e1] = await UserRepo.findById(parseInt(data.participants[0]))
        const [p2, e2] = await UserRepo.findById(parseInt(data.participants[1]))

        if (e1 || e2)
          return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Cannot find users to create conversation' }]

        groupName = p1?.username + ' <> ' + p2?.username
      }

      if (data.isGroup && !data.groupName) groupName = 'Default group name'

      const createdConversation = await prisma.conversation.create({
        data: {
          is_group: data.isGroup ?? false,
          group_name: data.groupName ?? groupName,
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

  async getConversations(
    userId: number,
    { page = 1, limit = 10 }: PaginatedSearchQuery
  ): Promise<RepoResponse<Paginated<ConversationDTO>>> {
    try {
      const skip = (page - 1) * limit

      const totalCount = await prisma.conversation.count({
        where: {
          participants: {
            some: { id: userId }
          }
        }
      })

      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: { id: userId }
          }
        },
        skip: skip,
        take: limit,
        include: {
          messages: true,
          participants: {
            select: {
              id: true,
              username: true,
              profile_picture_url: true
            }
          }
        }
      })

      if (!totalCount || !conversations) {
        Logger.error(`Error getting conversations`)
        return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Error finding conversations' }]
      }

      const totalPages = Math.ceil(totalCount / limit)
      const hasNextPage = page < totalPages

      return [{ data: conversations, page, limit, totalCount, totalPages, hasNextPage }, null]
    } catch (error: any) {
      Logger.error(`Error finding conversations: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  }
}

export default ConversationRepo
