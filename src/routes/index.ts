import * as E from 'express'
import testGet from './test/indexGet'
import testPost from './test/indexPost'
import postgresClient from '../database'

const router = E.Router()

router.get('/', async (request: E.Request, response: E.Response) => {
  const result = await postgresClient.query('SELECT NOW()')
  response.send(`Hello world in router root index.ts, result: ${JSON.stringify(result)}`)
})

router.use('/test', testGet)
router.use('/test', testPost)

export default router
