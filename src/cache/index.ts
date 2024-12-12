import { createClient } from 'redis'
import Logger from '../core/Logger'
import { REDIS_ACCESS_KEY_PRIMARY, REDIS_URL, REDIS_URL_AZ, REDIS_USERNAME_AZ } from '../config'

// LOCAL DEV ENVIRONMENT
export const redis = createClient({
  url: REDIS_URL
})

//export const redis = createClient({
//  url: REDIS_URL_AZ,
//  password: REDIS_ACCESS_KEY_PRIMARY
//})

export const connectRedis = async () => {
  try {
    await redis.connect()
    Logger.info('Connected to Redis')
  } catch (error: any) {
    Logger.error(`Error connecting redis: ${error}`)
  }
}

redis.on('connect', () => Logger.warn('Connecting redis'))
redis.on('reconnecting', () => Logger.info('Reconnecting redis'))
redis.on('error', (error) => Logger.error(`Redis Client Error:  ${error}`))

process.on('SIGINT', async () => {
  await redis.quit()
  Logger.info('Redis client disconnected')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await redis.quit()
  Logger.info('Redis client disconnected')
  process.exit(0)
})
