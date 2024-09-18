import express from 'express'
import { asyncHandler } from '../../core/asyncHandler'
import { ErrorType } from '../../core/errors'
import { SuccessResponse } from '../../core/responses'
import RefreshTokenRepo from '../../database/repository/RefreshTokenRepo'
import { validator } from '../../core/validator'
import { Access } from './schema'
import UserRepo from '../../database/repository/UserRepo'

const router = express.Router()

router.post(
  '/logout',
  validator(Access.logout),
  asyncHandler(async (request, response, next) => {
    const { id } = request.body
    if (!id) return next({ type: ErrorType.BAD_REQUEST, message: 'User id is required' })

    const isRefreshTokenDeleted = await RefreshTokenRepo.deleteByUserId(id)
    if (!isRefreshTokenDeleted) return next({ type: ErrorType.INTERNAL, message: 'Error deleting refresh token' })

    const setStatus = await UserRepo.updateUserIsActive(id, false)
    if (!setStatus) return next({ type: ErrorType.INTERNAL, message: 'Error deleting refresh token' })

    response.clearCookie('accessToken')
    response.clearCookie('refreshToken')

    return SuccessResponse('Logout succeeded', response)
  })
)

export default router
