import express from 'express'
import { asyncHandler } from '../../core/asyncHandler'
import UserRepo from '../../database/repository/UserRepo'
import Logger from '../../core/Logger'

const router = express.Router()

router.post(
  '/signup',
  asyncHandler(async (request, response, next) => {
    const exists = await UserRepo.findByEmail(request.body.email)
    if (exists) {
      Logger.error(`User already exists: ${exists}`)
      return
    }

    const results = await UserRepo.registerUser(request.body)

    if (!results) {
      Logger.error('User registration failed')
      return response.status(500).json({ messsage: 'User registration failed' })
    }

    const { user, accessToken, refreshToken } = results

    return response.status(201).json({
      user,
      accessToken,
      refreshToken
    })
  })
)

export default router
