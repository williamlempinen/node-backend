import * as E from 'express'

const router = E.Router()

router.get('/', (req: E.Request, res: E.Response) => {
  res.send('We are now in testing')
})

export default router
