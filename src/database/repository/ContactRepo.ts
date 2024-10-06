import { RepoResponse } from 'types'
import Logger from '../../core/Logger'
import { ErrorType } from '../../core/errors'
import { prismaClient as prisma } from '..'

type ContactPairType = {
  userId: number
  contactId: number
}

type IsUserContactType = {
  isContact: boolean
}

const ContactRepo = {
  async createContact(data: ContactPairType): Promise<RepoResponse<boolean>> {
    try {
      const createdContact = await prisma.contact.create({
        data: {
          user_id: data.userId,
          contact_id: data.contactId
        }
      })
      if (!createdContact) return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Could not create contact' }]

      return [true, null]
    } catch (error: any) {
      Logger.error(`Error occurred creating contact: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async isUserContact(data: ContactPairType): Promise<RepoResponse<IsUserContactType>> {
    try {
      const foundUser = await prisma.contact.findFirst({
        where: {
          OR: [
            { user_id: data.userId, contact_id: data.contactId },
            { user_id: data.contactId, contact_id: data.userId }
          ]
        }
      })

      Logger.info('Found user from contacts: ', JSON.stringify(foundUser))

      const isContact = !!foundUser

      Logger.warn('Is contact: ', isContact)
      return [{ isContact }, null]
    } catch (error: any) {
      Logger.error(`Error occurred creating contact: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  }
}

export default ContactRepo
