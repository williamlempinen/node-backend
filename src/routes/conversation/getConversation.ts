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
  `/get-conversation/:id`,
  validator(Conversation.getConversation, ValidationSource.PARAMS),
  asyncHandler(async (request, response, next) => {
    const { id } = request.params

    Logger.info(`Get conversation for id: ${id}`)

    const [conversation, error] = await ConversationRepo.getConversation(parseInt(id))
    if (error) return next({ type: error.type, errorMessage: error.errorMessage })

    return SuccessResponse('Conversation id found', response, conversation)
  })
)

export default router
