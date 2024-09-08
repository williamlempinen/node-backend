import dotenv from 'dotenv'
import path from 'path'
import Logger from './core/Logger'

if (process.env.NODE_ENV === 'development') {
  Logger.info('using local')
  dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
} else {
  dotenv.config({ path: path.resolve(__dirname, '../.env') })
}

export const port = process.env.PORT || 8000
export const DATABASE_URL = process.env.DATABASE_URL!
export const JWT_SECRET = process.env.JWT_SECRET!
export const REDIS_HOST = process.env.REDIS_HOST!
export const REDIS_PORT = process.env.REDIS_PORT!
export const REDIS_URL = process.env.REDIS_URL!
