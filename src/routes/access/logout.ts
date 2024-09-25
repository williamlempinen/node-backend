import express from 'express'
import { asyncHandler } from '../../core/asyncHandler'
import { ErrorType } from '../../core/errors'
import { SuccessResponse } from '../../core/responses'
import RefreshTokenRepo from '../../database/repository/RefreshTokenRepo'
import { validator } from '../../core/validator'
import { Access } from './schema'
import UserRepo from '../../database/repository/UserRepo'
import { redisDelete, redisGet } from '../../cache/repository'
import { verifyJwtToken } from '../../auth/JWT'
import Logger from '../../core/Logger'

const router = express.Router()

router.post(
  '/logout',
  validator(Access.logout),
  asyncHandler(async (request, response, next) => {
    const { sessionId } = request.body
    if (!sessionId) return next({ type: ErrorType.BAD_REQUEST, message: 'Session id is required' })

    const cachedData = await redisGet(sessionId)
    if (!cachedData) return next({ type: ErrorType.INTERNAL, message: 'Token not found from sessions' })

    const decodedToken = verifyJwtToken(JSON.parse(cachedData).accessToken)
    if (!decodedToken || !decodedToken.id)
      return next({ type: ErrorType.INTERNAL, message: 'Token not found from sessions' })

    Logger.warn('DECODED TOKEN: ', decodedToken)

    const [isRefreshTokenDeleted, error] = await RefreshTokenRepo.deleteByUserId(decodedToken.id)
    if (error) return next({ type: error.type, message: error.errorMessage })

    const setStatus = await UserRepo.updateUserIsActive(decodedToken.id, false)
    if (!setStatus) return next({ type: ErrorType.INTERNAL, message: 'Error deleting refresh token' })

    redisDelete(sessionId)

    return SuccessResponse('Logout succeeded', response)
  })
)

export default router
