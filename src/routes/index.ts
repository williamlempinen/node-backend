import express, { Request, Response } from 'express'
import Logger from '../core/Logger'
import testGet from './test/indexGet'
import testPost from './test/indexPost'
import testDatabase from './test/testDatabase'

import signup from './access/singup'

const rootRouter = express.Router()

rootRouter.get('/', async (request: Request, response: Response) => {
  response.send(`Hello world in router root index.ts`)
})

// ------------------ TESTING --------------------
rootRouter.use('/test', testGet)
rootRouter.use('/test', testPost)
rootRouter.use('/test', testDatabase)
// -----------------------------------------------

rootRouter.get('/access', async (request: Request, response: Response) => {
  const req = request.params
  Logger.debug(`Request params ${req}`)
  response.send(`Hello world in ${request.params}`)
})

rootRouter.use('/access', signup)

export default rootRouter
