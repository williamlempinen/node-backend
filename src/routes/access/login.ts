import express from 'express'
import { validator } from '../../core/validator'
import Access from './schema'
import { asyncHandler } from '../../core/asyncHandler'
import UserRepo from '../../database/repository/UserRepo'
import Logger from '../../core/Logger'
import { ErrorType } from '../../core/errors'
import { SuccessResponse } from '../../core/responses'

const router = express.Router()

router.post(
  '/login',
  validator(Access.login),
  asyncHandler(async (request, response, next) => {
    const results = await UserRepo.login(request.body)

    if (!results) {
      Logger.error('Error during login')
      return next({ type: ErrorType.INTERNAL, message: 'User login failed' })
    }

    const { user, accessToken, refreshToken } = results

    Logger.info(`Login user: ${user}`)

    return SuccessResponse('Login succeeded', response, { user, accessToken, refreshToken })
  })
)

export default router
