import express from 'express'
import authenticate from '../../auth/authenticate'
import { validator } from '../../core/validator'
import { asyncHandler } from '../../core/asyncHandler'
import Logger from '../../core/Logger'
import Message from './schema'
import MessageRepo from '../../database/repository/MessageRepo'
import { SuccessResponse } from '../../core/responses'

const router = express.Router()

router.use('/', authenticate)

router.post(
  '/create-message',
  validator(Message.createMessage),
  asyncHandler(async (request, response, next) => {
    Logger.info('Creating message')

    const [createMessage, error] = await MessageRepo.createMessage(request.body)
    if (error) return next({ type: error.type, errorMessage: error.errorMessage })

    return SuccessResponse('Message created', response, createMessage)
  })
)

export default router
