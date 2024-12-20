import express from 'express'
import Logger from '../../core/Logger'
import { asyncHandler } from '../../core/asyncHandler'
import { validator } from '../../core/validator'
import { Access } from './schema'
import { RefreshTokenResponse } from '../../core/responses'
import UserRepo from '../../database/repository/UserRepo'
import RefreshTokenRepo from '../../database/repository/RefreshTokenRepo'
import { ErrorType } from '../../core/errors'
import { createTokens } from '../../auth/authUtils'
import authenticate from '../../auth/authenticate'

const router = express.Router()

router.use('/', authenticate)

router.post(
  '/refreshtoken',
  validator(Access.refreshToken),
  asyncHandler(async (request, response, next) => {
    const [storedToken, error] = await RefreshTokenRepo.findByUserId(request.body.id)
    if (error) return next({ type: error.type, message: error.errorMessage })

    Logger.info(`Found token in DB: ${storedToken?.token_hash}`)
    Logger.info(`Token from client: ${request.body.refreshToken}`)

    if (storedToken?.token_hash !== request.body.refreshToken)
      return next({ type: ErrorType.BAD_REQUEST, message: 'Invalid refresh token' })

    if (storedToken && storedToken?.expires_at < new Date()) {
      Logger.error('Refresh token expired')
      return next({ type: ErrorType.BAD_REQUEST, message: 'Refresh token expired' })
    }

    if (!storedToken || !storedToken.user_id || storedToken.user_id !== request.body.id) {
      Logger.error('User id does not match')
      return next({ type: ErrorType.BAD_REQUEST, message: 'User id does not match' })
    }

    Logger.info(`Found token: ${storedToken}, for user id: ${storedToken?.user_id}`)

    const [user, errorInUserRepo] = await UserRepo.findById(storedToken?.user_id)
    if (errorInUserRepo) return next({ type: errorInUserRepo.type, message: errorInUserRepo.errorMessage })
    Logger.info(`Found user: ${user?.email}, with id: ${user?.id}`)

    if (!user) return next({ type: ErrorType.NOT_FOUND, message: 'User not found' })

    const { accessToken, refreshToken } = await createTokens(user)

    await RefreshTokenRepo.create(user.id, refreshToken)

    Logger.info(`Tokens refreshed for user: ${user.email}`)

    return RefreshTokenResponse('Tokens refreshed', response, accessToken, refreshToken)
  })
)

export default router
