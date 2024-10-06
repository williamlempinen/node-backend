import { RepoResponse } from 'types'
import { prismaClient as prisma } from '..'
import Logger from '../../core/Logger'
import { ErrorType } from '../../core/errors'

type CreateConversationType = {
  isGroup?: boolean
  participants: string[]
}

const ConversationRepo = {
  async createConversation(data: CreateConversationType): Promise<RepoResponse<boolean>> {
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

      return [true, null]
    } catch (error: any) {
      Logger.error(`Error occurred: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  }
}

export default ConversationRepo
