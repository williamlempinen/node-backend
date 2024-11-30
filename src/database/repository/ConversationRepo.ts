import { Paginated, PaginatedSearchQuery, RepoResponse } from 'types'
import { prismaClient as prisma } from '..'
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

        if (e1 || e2 || !p1 || !p2)
          return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Cannot find users to create conversation' }]

        const [privateConversationExists, notExists] =
          await ConversationRepo.getPrivateConversationIdFromParticipantIds(p1.id, p2.id)

        if (privateConversationExists)
          return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Private conversation already exists' }]

        groupName = p1?.username + ' <> ' + p2?.username
      }

      if (data.isGroup && !data.groupName) groupName = 'Default group name'

      const createdConversation = await prisma.conversation.create({
        data: {
          is_group: data.isGroup ?? false,
          group_name: data.isGroup && data.groupName ? data.groupName : groupName,
          participants: {
            connect: data.participants.map((pId) => ({
              id: parseInt(pId)
            }))
          }
        },
        include: {
          messages: {
            take: 30,
            orderBy: {
              created_at: 'desc'
            }
          },
          participants: {
            select: {
              id: true,
              username: true,
              profile_picture_url: true,
              is_active: true
            }
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

  async getConversation(id: number): Promise<RepoResponse<ConversationDTO>> {
    try {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: id
        },
        include: {
          messages: {
            take: 30,
            orderBy: {
              created_at: 'desc'
            }
          },
          participants: {
            select: {
              id: true,
              username: true,
              profile_picture_url: true,
              is_active: true
            }
          }
        }
      })
      if (!conversation) return [null, { type: ErrorType.NOT_FOUND, errorMessage: 'No conversations found' }]

      Logger.info('DATA: ', conversation.group_name)

      if (conversation === undefined) {
        Logger.info('UNDEFINED')
      }

      return [conversation, null]
    } catch (error: any) {
      Logger.error(`Error getting conversation: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async getConversations(
    userId: number,
    { page = 1, limit = 20 }: PaginatedSearchQuery
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

      if (totalCount === 0)
        return [{ data: [], page: 1, limit: 10, totalCount: 0, totalPages: 0, hasNextPage: false }, null]

      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: { id: userId }
          }
        },
        skip: skip,
        take: limit,
        orderBy: {
          updated_at: 'desc'
        },
        include: {
          messages: {
            take: 30,
            orderBy: {
              created_at: 'desc'
            }
          },
          participants: {
            select: {
              id: true,
              username: true,
              profile_picture_url: true,
              is_active: true
            }
          }
        }
      })

      Logger.warn('TOTAL COUNT: ', totalCount, ' CONVERSATIONS: ', conversations)

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
  },

  async updateConversationOnNewMessages(conversationId: string): Promise<RepoResponse<boolean>> {
    try {
      const updateSuccess = await prisma.conversation.update({
        where: {
          id: parseInt(conversationId)
        },
        data: {
          updated_at: new Date()
        }
      })
      if (!updateSuccess)
        return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Bad request for updating conversation' }]

      return [true, null]
    } catch (error: any) {
      Logger.error(`Error updating conversation updated_at field: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async updateMessagesAsSeen(conversationId: number): Promise<RepoResponse<boolean>> {
    try {
      const updateSuccess = await prisma.conversation.update({
        where: {
          id: conversationId
        },
        data: {
          messages: {
            updateMany: {
              where: {
                is_seen: false
              },
              data: {
                is_seen: true
              }
            }
          }
        }
      })
      if (!updateSuccess)
        return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Bad request updating messages as seen' }]

      return [true, null]
    } catch (error: any) {
      Logger.error(`Error occurred when updating message is_seen state: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async getPrivateConversationIdFromParticipantIds(oneId: number, secId: number): Promise<RepoResponse<number | null>> {
    try {
      const conversation = await prisma.conversation.findFirst({
        where: {
          is_group: false,
          participants: {
            every: { id: { in: [oneId, secId] } },
            none: { id: { notIn: [oneId, secId] } }
          }
        },
        select: {
          id: true
        }
      })
      // this is not error, there just does not exist a conversation
      // between these users
      if (!conversation) {
        Logger.verbose('NO CONVERSATION')
        return [null, { type: ErrorType.NOT_FOUND, errorMessage: 'No existing conversation' }]
      }

      Logger.verbose('CONVERSATION FOUND')
      return [conversation.id, null]
    } catch (error: any) {
      Logger.error(`Error finding private conversation: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server  error' }]
    }
  }
}

export default ConversationRepo
