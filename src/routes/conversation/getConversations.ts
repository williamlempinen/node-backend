import express from 'express'
import { ValidationSource, validator } from '../../core/validator'
import Conversation from './schema'
import { asyncHandler } from '../../core/asyncHandler'
import Logger from '../../core/Logger'
import authenticate from '../../auth/authenticate'
import ConversationRepo from '../../database/repository/ConversationRepo'
import { SuccessResponse } from '../../core/responses'

const router = express.Router()

router.use('/', authenticate)

router.get(
  `/get-conversations/:userId`,
  validator(Conversation.getConversation, ValidationSource.PARAMS),
  asyncHandler(async (request, response, next) => {
    const { userId } = request.params

    Logger.info(`Get conversations: ${userId}`)

    const [conversationsPage, error] = await ConversationRepo.getConversations(parseInt(userId), { page: 1, limit: 10 })
    if (error) return next({ type: error.type, errorMessage: error.errorMessage })

    return SuccessResponse('Conversations found', response, conversationsPage)
  })
)

export default router
