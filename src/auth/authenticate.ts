import express from 'express'
import { ValidationSource, validator } from '../core/validator'
import { Auth } from './schema'
import { asyncHandler } from '../core/asyncHandler'
import { getAccessToken } from './authUtils'
import { ErrorType } from '../core/errors'
import { verifyJwtToken } from './JWT'
import UserRepo from '../database/repository/UserRepo'
import Logger from '../core/Logger'

const router = express.Router()

router.use(
  validator(Auth.authenticate, ValidationSource.HEADERS),
  asyncHandler(async (request, response, next) => {
    const accessToken = getAccessToken(request.headers.authorization)

    if (!accessToken || accessToken.length === 0)
      return next({ type: ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' })

    const decodedToken = verifyJwtToken(accessToken)
    if (!decodedToken || !decodedToken.id) return next({ type: ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' })

    const [user, error] = await UserRepo.findById(decodedToken.id)
    if (error) return next({ type: ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' })

    return next()
  })
)

export default router
