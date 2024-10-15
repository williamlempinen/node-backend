import express, { Request, Response } from 'express'
import testGet from './test/indexGet'
import testPost from './test/indexPost'
import testDatabase from './test/testDatabase'

import UserRepo from '../database/repository/UserRepo'

import signup from './access/singup'
import login from './access/login'
import logout from './access/logout'
import refreshToken from './access/refreshToken'

import validateSession from '../auth/validateSession'
import authenticate from '../auth/authenticate'

import activeUsers from './users/activeUsers'
import searchUsers from './users/searchUsers'

import createConversation from './conversation/createConversation'
import getConversations from './conversation/getConversations'

import createContact from './contact/createContact'

import createMessage from './message/createMessage'

import Logger from '../core/Logger'

const rootRouter = express.Router()

rootRouter.get('/', async (request: Request, response: Response) => {
  response.send(`Hello world in router root index.ts`)
})

// ------------------ TESTING --------------------
//rootRouter.use('/test', testGet)
//rootRouter.use('/test', testPost)
//rootRouter.use('/test', testDatabase)
// -----------------------------------------------

// ------------------ ACCESS ---------------------
rootRouter.get('/access', async (request: Request, response: Response) => {
  const users = await UserRepo.findAll()
  response.send(`All created users: ${JSON.stringify(users)}`)
})

rootRouter.use('/access', signup)
rootRouter.use('/access', login)
rootRouter.use('/access', logout)
rootRouter.use('/access', validateSession)

// ------- USING AUTHENTICATE MIDDLEWARE ---------
// -----------------------------------------------

rootRouter.use('/access', refreshToken)
// -----------------------------------------------

// ------------------ USERS ----------------------
rootRouter.use('/users', activeUsers)
rootRouter.use('/users', searchUsers)
// -----------------------------------------------

// --------------- CONVERSATION ------------------
rootRouter.use('/conversation', createConversation)
rootRouter.use('/conversation', getConversations)
// -----------------------------------------------

// ----------------- CONTACT ---------------------
rootRouter.use('/contact', createContact)
// -----------------------------------------------

// ----------------- MESSAGE ---------------------
rootRouter.use('/message', createMessage)
// -----------------------------------------------

// -----------------------------------------------
rootRouter.use('/protected', authenticate)
rootRouter.get('/protected', authenticate, async (request: Request, response: Response) => {
  Logger.info('REQUEST: ', JSON.stringify(request.headers))
  Logger.info('REQUEST: ', JSON.stringify(request.cookies))
  Logger.info('REQUEST: ', JSON.stringify(request.body))
  response.send(`You are authorized to see this message, ${JSON.stringify(request.body)}`)
})

export default rootRouter
