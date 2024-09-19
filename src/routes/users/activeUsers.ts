import express from 'express'
import { asyncHandler } from '../../core/asyncHandler'
import UserRepo from '../../database/repository/UserRepo'
import { SuccessResponse } from '../../core/responses'
import Logger from '../../core/Logger'
import authenticate from '../../auth/authenticate'

const router = express.Router()

router.use('/', authenticate)

router.get(
  '/active-users',
  asyncHandler(async (request, response, next) => {
    const [activeUsers, error] = await UserRepo.findAllActiveUsers()
    if (error) return next({ type: error.type, message: error.errorMessage })

    Logger.info(`Active users: ${activeUsers}`)

    return SuccessResponse('Successfully found active users', response, activeUsers)
  })
)

export default router
