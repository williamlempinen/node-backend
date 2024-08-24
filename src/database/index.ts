import pg from 'pg'
import { postgresDB as db } from '../config'
import Logger from '../core/Logger'

const { Client } = pg

const postgresClient = new Client({
  user: db.user,
  password: db.password,
  host: db.host,
  port: db.port,
  database: db.database
})

postgresClient
  .connect()
  .then(() => Logger.info('Connected to PostgreSQL database'))
  .catch((error: Error) => Logger.error(`PostgreSQL conneection error: ${error.stack}`))

export default postgresClient
