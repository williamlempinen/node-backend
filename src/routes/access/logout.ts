import express from 'express'
import { asyncHandler } from '../../core/asyncHandler'
import { ErrorType } from '../../core/errors'
import { SuccessResponse } from '../../core/responses'
import RefreshTokenRepo from '../../database/repository/RefreshTokenRepo'
import { validator } from '../../core/validator'
import { Access } from './schema'

const router = express.Router()

router.post(
  '/logout',
  validator(Access.logout),
  asyncHandler(async (request, response, next) => {
    const { userId } = request.body

    if (!userId) {
      return next({ type: ErrorType.BAD_REQUEST, message: 'User id is required' })
    }

    const isRefreshTokenDeleted = await RefreshTokenRepo.deleteByUserId(userId)

    if (!isRefreshTokenDeleted) {
      return next({ type: ErrorType.INTERNAL, message: 'Error deleting refresh token' })
    }

    response.clearCookie('accessToken')
    response.clearCookie('refreshToken')

    return SuccessResponse('Logout succeeded', response)
  })
)

export default router
