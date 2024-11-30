import express from 'express'
import { ValidationSource, validator } from '../../core/validator'
import Conversation from './schema'
import { asyncHandler } from '../../core/asyncHandler'
import Logger from '../../core/Logger'
import authenticate from '../../auth/authenticate'
import ConversationRepo from '../../database/repository/ConversationRepo'
import { SuccessResponse } from '../../core/responses'
import { HOUR_STR } from '../../constants'

const router = express.Router()

router.use('/', authenticate)

router.get(
  `/get-conversation-id/:oneId/:secId`,
  validator(Conversation.getConversationId, ValidationSource.PARAMS),
  asyncHandler(async (request, response, next) => {
    const { oneId, secId } = request.params

    Logger.info(`Get conversation id for ids: ${oneId} ${secId}`)

    const [conversationId, noConversation] = await ConversationRepo.getPrivateConversationIdFromParticipantIds(
      parseInt(oneId),
      parseInt(secId)
    )
    if (noConversation) return SuccessResponse('No conversation', response)

    return SuccessResponse('Conversation id found', response, conversationId)
  })
)

export default router
