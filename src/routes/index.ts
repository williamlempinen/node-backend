import * as E from 'express'
import testGet from './test/indexGet'
import testPost from './test/indexPost'

const router = E.Router()

router.get('/', (request: E.Request, response: E.Response) => {
  response.send('Hello world in router root index.ts')
})

router.use('/test', testGet)
router.use('/test', testPost)

export default router
