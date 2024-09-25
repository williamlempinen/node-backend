import { redis } from '.'
import Logger from '../core/Logger'

export const redisSet = async (id: string, data: string, expires: number) => {
  try {
    await redis.set(id, data, {
      EX: expires
    })
  } catch (error: any) {
    Logger.error(`Error setting value in redis: ${error}`)
  }
}

export const redisGet = async (id: string): Promise<string | null> => {
  try {
    const data = await redis.get(id)
    Logger.warn(`REDIS: ${data}`)
    return data
  } catch (error: any) {
    Logger.error(`Error getting value in redis: ${error}`)
    return null
  }
}

export const redisDelete = async (id: string) => {
  try {
    await redis.del(id)
  } catch (error: any) {
    Logger.error(`Error deleting value in redis: ${error}`)
  }
}
