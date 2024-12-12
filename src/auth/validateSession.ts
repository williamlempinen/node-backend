import express from 'express'
import { ValidationSource, validator } from '../core/validator'
import { Auth } from './schema'
import { asyncHandler } from '../core/asyncHandler'
import { ErrorType } from '../core/errors'
import { SuccessResponse } from '../core/responses'
import UserRepo from '../database/repository/UserRepo'
import { verifyJwtToken } from './JWT'

const router = express.Router()

router.post(
  '/validate-session',
  validator(Auth.validate, ValidationSource.BODY, 'valiate-session'),
  asyncHandler(async (request, response, next) => {
    const { accessToken, refreshToken } = request.body
    if (!accessToken || !refreshToken) return next({ type: ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' })

    const decodedToken = verifyJwtToken(accessToken)
    if (!decodedToken || !decodedToken.id) return next({ type: ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' })

    const [user, error] = await UserRepo.findById(decodedToken.id)
    if (error) return next({ type: error.type, errorMessage: error.errorMessage })

    return SuccessResponse('Authenticated', response, user)
  })
)

export default router
