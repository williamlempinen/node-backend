import express from 'express'
import authenticate from '../../auth/authenticate'
import { validator } from '../../core/validator'
import { asyncHandler } from '../../core/asyncHandler'
import Logger from '../../core/Logger'
import { SuccessResponse } from '../../core/responses'
import Conversation from './schema'
import ConversationRepo from '../../database/repository/ConversationRepo'

const router = express.Router()

router.use('/', authenticate)

router.post(
  '/update-messages',
  validator(Conversation.updateMessagesAsSeen),
  asyncHandler(async (request, response, next) => {
    Logger.info('Updating messages as seen')

    const { conversationId } = request.body

    const [isUpdated, error] = await ConversationRepo.updateMessagesAsSeen(conversationId)
    if (error) return next({ type: error.type, message: error.errorMessage })

    return SuccessResponse('Messages updated', response, isUpdated)
  })
)

export default router
