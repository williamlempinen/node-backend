import express from 'express'
import { asyncHandler } from '../../core/asyncHandler'
import UserRepo from '../../database/repository/UserRepo'
import Logger from '../../core/Logger'
import { validator } from '../../core/validator'
import { Access } from './schema'
import { SuccessResponse } from '../../core/responses'
import { ErrorType } from '../../core/errors'

const router = express.Router()

router.post(
  '/signup',
  validator(Access.signup),
  asyncHandler(async (request, response, next) => {
    const exists = await UserRepo.findByEmail(request.body.email)

    if (exists) {
      Logger.error(`User already exists: ${exists}`)
      return next({ type: ErrorType.BAD_REQUEST, message: 'User already exists' })
    }

    const [user, error] = await UserRepo.registerUser(request.body)

    if (error) {
      Logger.error('User registration failed')
      return next({ type: error.type, message: error.errorMessage })
    }

    Logger.info(`Signup user: ${user?.user}`)

    return SuccessResponse('Signup succeeded', response, user)
  })
)

export default router
