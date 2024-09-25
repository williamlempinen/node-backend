import express from 'express'
import { validator } from '../core/validator'
import { Auth } from './schema'
import { asyncHandler } from '../core/asyncHandler'
import Logger from '../core/Logger'
import { ErrorType } from '../core/errors'
import { redisGet } from '../cache/repository'
import { SuccessResponse } from '../core/responses'

const router = express.Router()

router.post(
  '/validate-session',
  validator(Auth.validate),
  asyncHandler(async (request, response, next) => {
    const { sessionId } = request.body

    if (!sessionId) {
      Logger.error('No session id present')
      return next({ type: ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' })
    }

    Logger.warn('SESSION: ', sessionId)
    const isValidSession = await redisGet(sessionId)
    if (!isValidSession || !JSON.parse(isValidSession).accessToken || !JSON.parse(isValidSession).refreshToken) {
      return next({ type: ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' })
    }

    return SuccessResponse('Authenticated', response)
  })
)

export default router
