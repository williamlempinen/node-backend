import dotenv from 'dotenv'
dotenv.config()
import Logger from './core/Logger'

export const port = process.env.PORT!
export const DATABASE_URL = process.env.DATABASE_URL!
export const JWT_SECRET = process.env.JWT_SECRET!
export const REDIS_HOST = process.env.REDIS_HOST!
export const REDIS_PORT = process.env.REDIS_PORT!
export const REDIS_URL = process.env.REDIS_URL!
Logger.debug('Hello from config.ts')
Logger.debug(
  `port: ${port}, DATABASE_URL: ${DATABASE_URL}, JWT_SECRET: ${JWT_SECRET}, REDIS_PORT: ${REDIS_PORT}, REDIS_URL: ${REDIS_URL}`
)
