import express from 'express'
import { asyncHandler } from '../../core/asyncHandler'
import UserRepo from '../../database/repository/UserRepo'
import Logger from '../../core/Logger'
import { validator } from '../../core/validator'
import Access from './schema'

const router = express.Router()

router.post(
  '/signup',
  validator(Access.signup),
  asyncHandler(async (request, response) => {
    const exists = await UserRepo.findByEmail(request.body.email)
    if (exists) {
      Logger.error(`User already exists: ${exists}`)
      return
    }
    Logger.info('test')
    const results = await UserRepo.registerUser(request.body)

    if (!results) {
      Logger.error('User registration failed')
      return response.status(500).json({ messsage: 'User registration failed' })
    }

    const { user, accessToken, refreshToken } = results

    Logger.info(`Signup user: ${user}`)

    return response.status(201).json({
      user,
      accessToken,
      refreshToken
    })
  })
)

export default router
