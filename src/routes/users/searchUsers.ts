import express from 'express'
import authenticate from '../../auth/authenticate'
import { asyncHandler } from '../../core/asyncHandler'
import UserRepo from '../../database/repository/UserRepo'
import Logger from '../../core/Logger'
import { SuccessResponse } from '../../core/responses'

const router = express.Router()

router.use('/', authenticate)

router.get(
  '/search-users',
  asyncHandler(async (request, response, next) => {
    const { query } = request.query
    if (!query || query.toString().length < 2) return

    const [searchResults, error] = await UserRepo.searchUsers({ searchQuery: query?.toString() })
    if (error) {
      Logger.error('Error searching users, route')
      return next({ type: error.type, message: error.errorMessage })
    }

    return SuccessResponse('Users searched successfully', response, searchResults)
  })
)

export default router
