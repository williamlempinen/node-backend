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
  `/get-conversations/:userId/:pageNumber`,
  validator(Conversation.getConversations, ValidationSource.PARAMS),
  asyncHandler(async (request, response, next) => {
    const { userId, pageNumber } = request.params

    Logger.info(`Get conversations for user with id: ${userId}`)

    let page = parseInt(pageNumber) || 1

    const [conversationsPage, error] = await ConversationRepo.getConversations(parseInt(userId), {
      page: page,
      limit: 20
    })
    if (error) return next({ type: error.type, message: error.errorMessage })

    const res = response.append('Cache-Control', HOUR_STR)

    return SuccessResponse('Conversations found', res, conversationsPage)
  })
)

export default router
