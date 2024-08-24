import * as E from 'express'
import Logger from '../../core/Logger'

const router = E.Router()

router.post('/', (req: E.Request, res: E.Response) => {
  const somePayload = req.body

  Logger.info(`Post paylod ${somePayload}`)
})

export default router
