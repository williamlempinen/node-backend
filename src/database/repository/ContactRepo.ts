import { Paginated, PaginatedSearchQuery, RepoResponse } from 'types'
import Logger from '../../core/Logger'
import { ErrorType } from '../../core/errors'
import { prismaClient as prisma } from '..'
import { ContactDTO } from '../models/ContactDTO'

type ContactPairType = {
  userId: string
  contactId: string
}

const ContactRepo = {
  async createContact(data: ContactPairType): Promise<RepoResponse<ContactDTO>> {
    try {
      const createdContact = await prisma.contact.create({
        data: {
          user_id: parseInt(data.userId),
          contact_id: parseInt(data.contactId)
        }
      })
      if (!createdContact) return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Could not create contact' }]

      Logger.info(`Created contact: ${createdContact}`)

      return [createdContact, null]
    } catch (error: any) {
      Logger.error(`Error occurred creating contact: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async deleteContact(data: ContactPairType): Promise<RepoResponse<boolean>> {
    try {
      const isContactDeleted = await prisma.contact.delete({
        where: {
          user_id_contact_id: {
            user_id: parseInt(data.userId),
            contact_id: parseInt(data.contactId)
          }
        }
      })
      if (!isContactDeleted)
        return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Could not delete the contact' }]

      return [true, null]
    } catch (error: any) {
      Logger.error(`Error occurred deleting contact: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async isUserContact(data: ContactPairType): Promise<RepoResponse<boolean>> {
    try {
      const foundUser = await prisma.contact.findFirst({
        where: {
          OR: [
            { user_id: parseInt(data.userId), contact_id: parseInt(data.contactId) },
            { user_id: parseInt(data.contactId), contact_id: parseInt(data.userId) }
          ]
        }
      })

      Logger.info('Found user from contacts: ', JSON.stringify(foundUser))

      const isContact = !!foundUser

      Logger.warn('Is contact: ', isContact)

      return [isContact, null]
    } catch (error: any) {
      Logger.error(`Error occurred creating contact: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  },

  async getContacts(
    userId: number,
    { page = 1, limit = 10 }: PaginatedSearchQuery
  ): Promise<RepoResponse<Paginated<ContactDTO>>> {
    try {
      const skip = (page - 1) * limit

      const totalCount = await prisma.contact.count({
        where: {
          user_id: userId
        }
      })

      const contacts = await prisma.contact.findMany({
        where: {
          user_id: userId
        },
        skip: skip,
        take: limit
      })

      if (!totalCount || !contacts) {
        Logger.error(`Error getting contacts`)
        return [null, { type: ErrorType.BAD_REQUEST, errorMessage: 'Error finding contacts' }]
      }

      const totalPages = Math.ceil(totalCount / limit)
      const hasNextPage = page < totalPages

      return [{ data: contacts, page, limit, totalCount, totalPages, hasNextPage }, null]
    } catch (error: any) {
      Logger.error(`Error finding contacts: ${error}`)
      return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
    }
  }
}

export default ContactRepo
