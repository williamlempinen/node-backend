import { createClient } from 'redis'
import Logger from '../core/Logger'

export const redis = createClient({
  url: process.env.REDIS_URL
})

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
