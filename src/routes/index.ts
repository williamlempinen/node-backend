import * as E from 'express'
import testGet from './test/indexGet'
import testPost from './test/indexPost'
import testDatabase from './test/testDatabase'

const rootRouter = E.Router()

rootRouter.get('/', async (request: E.Request, response: E.Response) => {
  response.send(`Hello world in router root index.ts`)
})

// ------------------ TESTING --------------------
rootRouter.use('/test', testGet)
rootRouter.use('/test', testPost)
rootRouter.use('/test', testDatabase)
// -----------------------------------------------

export default rootRouter
