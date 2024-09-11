import express, { Request, Response } from 'express'
import Logger from '../core/Logger'
import testGet from './test/indexGet'
import testPost from './test/indexPost'
import testDatabase from './test/testDatabase'

import signup from './access/singup'
import login from './access/login'
import logout from './access/logout'
import UserRepo from '../database/repository/UserRepo'

import authenticate from '../auth/authenticate'

const rootRouter = express.Router()

rootRouter.get('/', async (request: Request, response: Response) => {
  response.send(`Hello world in router root index.ts`)
})

// ------------------ TESTING --------------------
rootRouter.use('/test', testGet)
rootRouter.use('/test', testPost)
rootRouter.use('/test', testDatabase)
// -----------------------------------------------

// ------------------ ACCESS ---------------------
rootRouter.get('/access', async (request: Request, response: Response) => {
  const req = request.params
  const users = await UserRepo.findAll()
  Logger.debug(`Request params ${req}`)
  response.send(`Hello world in access, ${JSON.stringify(users)}`)
})

rootRouter.use('/access', signup)
rootRouter.use('/access', login)
rootRouter.use('/access', logout)
// -----------------------------------------------

//rootRouter.use(authenticate)

export default rootRouter
