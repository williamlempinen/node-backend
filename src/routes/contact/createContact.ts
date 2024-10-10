import express from 'express'
import { validator } from '../../core/validator'
import { asyncHandler } from '../../core/asyncHandler'
import Contact from './schema'
import Logger from '../../core/Logger'
import ContactRepo from '../../database/repository/ContactRepo'
import { SuccessResponse } from '../../core/responses'
import authenticate from '../../auth/authenticate'

const router = express.Router()

router.use('/', authenticate)

router.post(
  '/create-contact',
  validator(Contact.createContact),
  asyncHandler(async (request, response, next) => {
    Logger.info(`Request in route: ${JSON.stringify(request.body)}`)

    const [isAlreadyContacts, error] = await ContactRepo.isUserContact(request.body)
    if (error) return next({ type: error.type, errorMessage: error.errorMessage })
    if (isAlreadyContacts) return SuccessResponse('User is already in your contacts', response, isAlreadyContacts)

    const [addUserToContacts, errorAdding] = await ContactRepo.createContact(request.body)
    if (errorAdding) return next({ type: errorAdding.type, errorMessage: errorAdding.errorMessage })

    return SuccessResponse('User added to your contacts', response, addUserToContacts)
  })
)

export default router
