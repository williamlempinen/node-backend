import express, { Request, Response } from 'express'
import { validator } from '../../core/validator'
import Access from './schema'
import { asyncHandler } from '../../core/asyncHandler'
import UserRepo from '../../database/repository/UserRepo'
import Logger from '../../core/Logger'

const router = express.Router()

router.post(
  '/login',
  validator(Access.login),
  asyncHandler(async (request: Request, response: Response) => {
    const results = await UserRepo.login(request.body)

    if (!results) {
      Logger.error('Error during login')
      return response.status(500).json({ message: 'User login failed' })
    }

    const { user, accessToken, refreshToken } = results

    Logger.info(`Login user: ${user}`)

    return response.status(201).json({
      user,
      accessToken,
      refreshToken
    })
  })
)

export default router
