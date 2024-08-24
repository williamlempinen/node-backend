import dotenv from 'dotenv'

dotenv.config()

const ENV = process.env

export const port = ENV.PORT || 8000

export const postgresDB = {
  user: ENV.DB_USER || '',
  password: ENV.DB_PASSWORD || '',
  host: ENV.DB_HOST || '',
  port: Number(ENV.DB_PORT) || 5432,
  database: ENV.DB_DATABASE || ''
}
