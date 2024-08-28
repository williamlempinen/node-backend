import * as E from 'express'
import UserRepo from '../../database/repository/UserRepo'

const router = E.Router()

router.get('/database', async (req: E.Request, res: E.Response) => {
  const result = await UserRepo.findAll()
  res.send(`Response from database: ${JSON.stringify(result)}`)
})

export default router
