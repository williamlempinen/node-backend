import express from 'express'
import { asyncHandler } from '../../core/asyncHandler'
import { validator } from '../../core/validator'
import Conversation from './schema'
import Logger from '../../core/Logger'
import ConversationRepo from '../../database/repository/ConversationRepo'
import { SuccessResponse } from '../../core/responses'
import authenticate from '../../auth/authenticate'

const router = express.Router()

router.use('/', authenticate)

router.post(
  '/add-user-to-group',
  validator(Conversation.addToGroup),
  asyncHandler(async (request, response, next) => {
    Logger.info(`Request: ${JSON.stringify(request.body)}`)

    const { userId, conversationId } = request.body

    const [conversation, error] = await ConversationRepo.addUserToGroup(userId, conversationId)
    if (error) return next({ type: error.type, message: error.errorMessage })

    Logger.info(`Added user to group`)
    return SuccessResponse('Added user to group', response, conversation)
  })
)

export default router
