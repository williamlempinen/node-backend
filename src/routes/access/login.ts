import express, { Request, Response } from 'express'
import { validator } from '../../core/validator'
import Access from './schema'
import { asyncHandler } from '../../core/asyncHandler'

const router = express.Router()

router.post(
  '/login',
  validator(Access.login),
  asyncHandler(async (request: Request, response: Response) => {})
)

export default router
