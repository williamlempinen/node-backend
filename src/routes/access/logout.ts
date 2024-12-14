import express from 'express'
import { asyncHandler } from '../../core/asyncHandler'
import { ErrorType } from '../../core/errors'
import { SuccessResponse } from '../../core/responses'
import RefreshTokenRepo from '../../database/repository/RefreshTokenRepo'
import { validator } from '../../core/validator'
import { Access } from './schema'
import UserRepo from '../../database/repository/UserRepo'
import { verifyJwtToken } from '../../auth/JWT'
import Logger from '../../core/Logger'

const router = express.Router()

router.post(
  '/logout',
  validator(Access.logout),
  asyncHandler(async (request, response, next) => {
    const { accessToken, refreshToken } = request.body

    if (!accessToken || !refreshToken)
      return next({ type: ErrorType.INTERNAL, message: 'Token not found from sessions' })

    const decodedToken = verifyJwtToken(accessToken)
    if (!decodedToken || !decodedToken.id)
      return next({ type: ErrorType.INTERNAL, message: 'Token not found from sessions' })

    Logger.warn('DECODED TOKEN: ', decodedToken)
    await UserRepo.updateUserIsActive(decodedToken.id, false)
    const [isRefreshTokenDeleted, error] = await RefreshTokenRepo.deleteByUserId(decodedToken.id)
    if (error) return next({ type: error.type, message: error.errorMessage })

    const setStatus = await UserRepo.updateUserIsActive(decodedToken.id, false)
    if (!setStatus) return next({ type: ErrorType.INTERNAL, message: 'Error deleting refresh token' })

    Logger.warn('LOGGING OUT')
    // --------------------------------------------------------------------------
    response.clearCookie('accessToken', { httpOnly: true, sameSite: 'strict' })
    response.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' })
    // --------------------------------------------------------------------------
    return SuccessResponse('Logout succeeded', response)
  })
)

export default router
