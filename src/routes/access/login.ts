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

    Logger.info(`LOGIN USER AND DATA FOR CLIENT: ${JSON.stringify(data)}`)

    response.cookie('accessToken', data?.accessToken, {
      httpOnly: true,
      sameSite: 'strict'
    })
    response.cookie('refreshToken', data?.refreshToken, {
      httpOnly: true,
      sameSite: 'strict'
    })

    return SuccessResponse('Login succeeded', response, data)
  })
)

export default router
