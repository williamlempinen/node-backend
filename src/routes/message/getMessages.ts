import express from 'express'
import authenticate from '../../auth/authenticate'
import { ValidationSource, validator } from '../../core/validator'
import { asyncHandler } from '../../core/asyncHandler'
import Logger from '../../core/Logger'
import Message from './schema'
import MessageRepo from '../../database/repository/MessageRepo'
import { SuccessResponse } from '../../core/responses'
import { HOUR_STR } from '../../constants'

const router = express.Router()

router.use('/', authenticate)

// this should be modified so that
// it can get older messages (pages 2- inf.) and fetch that
// returns conversations already returns the first page

router.get(
  '/get-messages/:conversationId/:pageNumber',
  validator(Message.getMessage, ValidationSource.PARAMS),
  asyncHandler(async (request, response, next) => {
    Logger.info('Getting messages')

    const { conversationId, pageNumber } = request.params

    const _conversationId = parseInt(conversationId)
    const _pageNumber = parseInt(pageNumber)

    const [getMessagesPage, error] = await MessageRepo.getMessages(_conversationId, { page: _pageNumber, limit: 30 })
    if (error) return next({ type: error.type, message: error.errorMessage })

    return SuccessResponse('Messages fetched', response, getMessagesPage)
  })
)

export default router
