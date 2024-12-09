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
  `/get-groups/:userId`,
  validator(Conversation.getConversations, ValidationSource.PARAMS),
  asyncHandler(async (request, response, next) => {
    const { userId } = request.params

    Logger.info(`Get conversations for user with id: ${userId}`)

    const [groupConversations, error] = await ConversationRepo.getGroupConversations(userId)
    if (error) return next({ type: error.type, message: error.errorMessage })

    return SuccessResponse('Group conversations found', response, groupConversations)
  })
)

export default router
