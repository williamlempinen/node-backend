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
import updateConversationMessagesAsSeen from './conversation/updateConversationMessagesAsSeen'
import getConversationId from './conversation/getConversationId'
import getConversation from './conversation/getConversation'

import createContact from './contact/createContact'
import deleteContact from './contact/deleteContact'

import createMessage from './message/createMessage'
import getMessages from './message/getMessages'

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
rootRouter.use('/conversation', updateConversationMessagesAsSeen)
rootRouter.use('/conversation', getConversationId)
rootRouter.use('/conversation', getConversation)
// -----------------------------------------------

// ----------------- CONTACT ---------------------
rootRouter.use('/contact', createContact)
rootRouter.use('/contact', deleteContact)
// -----------------------------------------------

// ----------------- MESSAGE ---------------------

// ********** this is not used -> messages created with ws *********
rootRouter.use('/message', createMessage)
rootRouter.use('/message', getMessages)
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
