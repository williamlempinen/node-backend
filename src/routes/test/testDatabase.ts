import * as E from 'express'
import { QueryResult } from 'pg'
import postgresClient from '../../database'
import Logger from '../../core/Logger'

const router = E.Router()

const returnDatabase = async (tableName: string): Promise<QueryResult<any>> => {
  const query = `SELECT * FROM ${tableName}`
  const result = await postgresClient.query(query)
  return result
}

const returnNow = async (): Promise<QueryResult<any>> => {
  const result = await postgresClient.query('SELECT NOW()')
  return result
}

router.get('/database', async (req: E.Request, res: E.Response) => {
  const result = await returnNow()
  res.send(`Response from database: ${JSON.stringify(result)}`)
})

router.get('/database/:tableName', async (req: E.Request, res: E.Response) => {
  const table = req.params.tableName

  try {
    const result = await returnDatabase(table)
    res.json(result.rows)
  } catch (error) {
    Logger.error(`Error in testDatabase ${error}`)
  }
})

export default router
