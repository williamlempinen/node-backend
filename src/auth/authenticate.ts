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
    const accessToken = getAccessToken(request.headers.authorization)
    if (!accessToken || accessToken.length === 0)
      return next({ type: ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' })

    const result = verifyJwtToken(accessToken)
    Logger.warn(`Returned from the verifyToken: ${result}`)

    //const [user, error] = await UserRepo.findById(id)
    //if (error) return next({ type: error.type, errorMessage: error.errorMessage })

    return next()
  })
)

export default router
