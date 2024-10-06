import express from 'express'
import { asyncHandler } from '../../core/asyncHandler'
import { validator } from '../../core/validator'
import Conversation from './schema'
import Logger from '../../core/Logger'
import ConversationRepo from '../../database/repository/ConversationRepo'
import { SuccessResponse } from '../../core/responses'

const router = express.Router()

router.post(
  '/create-conversation',
  validator(Conversation.createConversation),
  asyncHandler(async (request, response, next) => {
    Logger.info(`Request: ${JSON.stringify(request.body)}`)

    const [conversation, error] = await ConversationRepo.createConversation(request.body)
    if (error) return next({ type: error.type, errorMessage: error.errorMessage })

    Logger.info(`Created conversation: ${conversation}`)
    return SuccessResponse('Conversation created successfully', response, conversation)
  })
)

export default router
