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
    const [user, error] = await UserRepo.login(request.body)

    if (error) {
      Logger.error('Error during login')
      return next({ type: error.type, message: error.errorMessage })
    }

    Logger.info(`Login user: ${JSON.stringify(user)}`)

    return SuccessResponse('Login succeeded', response, user)
  })
)

export default router
