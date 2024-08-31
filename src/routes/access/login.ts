import express from 'express'
import { validator } from '../../core/validator'
import { Access } from './schema'
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

    if ('errorMessage' in results) {
      Logger.error('Error during login')
      return next({ type: ErrorType.INTERNAL, message: results.errorMessage })
    }

    Logger.info(`Login user: ${results.data}`)

    return SuccessResponse('Login succeeded', response, results.data)
  })
)

export default router
