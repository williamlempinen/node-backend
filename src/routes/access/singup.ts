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

    const results = await UserRepo.registerUser(request.body)

    if ('errorMessage' in results) {
      Logger.error('User registration failed')
      return next({ type: ErrorType.INTERNAL, message: results.errorMessage })
    }

    Logger.info(`Signup user: ${results.data.user.username}`)

    return SuccessResponse('Signup succeeded', response, results.data)
  })
)

export default router
