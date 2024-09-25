import express from 'express'
import { validator } from '../../core/validator'
import { Access } from './schema'
import { asyncHandler } from '../../core/asyncHandler'
import UserRepo from '../../database/repository/UserRepo'
import Logger from '../../core/Logger'
import { SuccessResponse } from '../../core/responses'

const router = express.Router()

router.post(
  '/login',
  validator(Access.login),
  asyncHandler(async (request, response, next) => {
    const [data, error] = await UserRepo.login(request.body)

    if (error) {
      Logger.error('Error during login')
      return next({ type: error.type, message: error.errorMessage })
    }

    Logger.info(`Login user: ${JSON.stringify(data)}`)

    if (!data) return

    response.cookie('sessionId', data.sessionId, {
      httpOnly: true, // Prevents JavaScript access
      secure: true, // Ensures cookie is sent over HTTPS
      maxAge: 3600 * 1000 // 1 hour in milliseconds
    })

    response.cookie('accessToken', data.accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600 * 1000
    })

    response.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 3600 * 1000 // 7 days in milliseconds
    })

    return SuccessResponse('Login succeeded', response, data)
  })
)

export default router
