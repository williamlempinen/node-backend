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
  validator(Auth.req, ValidationSource.HEADERS),
  asyncHandler(async (request, response, next) => {
    Logger.info('In auth middleware')
    const accessToken = getAccessToken(request.headers.authorization)
    Logger.warn(`Access token: ${accessToken}`)
    if (!accessToken || accessToken.length === 0)
      return next({ type: ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' })

    const decodedToken = verifyJwtToken(accessToken)
    Logger.warn(`Returned from the verifyToken: ${JSON.stringify(decodedToken)}`)
    if (!decodedToken || !decodedToken.id) return next({ type: ErrorType.UNAUTHORIZED, errorMessage: 'Invalid token' })

    const [user, error] = await UserRepo.findById(decodedToken.id)
    if (error) return next({ type: error.type, errorMessage: error.errorMessage })

    return next()
  })
)

export default router
