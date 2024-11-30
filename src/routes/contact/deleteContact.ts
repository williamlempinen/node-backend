import express from 'express'
import { validator } from '../../core/validator'
import { asyncHandler } from '../../core/asyncHandler'
import Contact from './schema'
import ContactRepo from '../../database/repository/ContactRepo'
import { SuccessResponse } from '../../core/responses'
import authenticate from '../../auth/authenticate'

const router = express.Router()

router.use('/', authenticate)

router.post(
  '/delete-contact',
  validator(Contact.pairContact),
  asyncHandler(async (request, response, next) => {
    const [deleteUserFromContacts, error] = await ContactRepo.deleteContact(request.body)
    if (error) return next({ type: error.type, message: error.errorMessage })

    return SuccessResponse('User added to your contacts', response, deleteUserFromContacts)
  })
)

export default router
