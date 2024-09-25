import { redis } from '.'

export const redisSet = async (id: string, data: string, expires: number) => {
  await redis.set(id, data, {
    EX: expires
  })
}

export const redisGet = async (id: string) => {
  const data = await redis.get(id)
  return data
}

export const redisDelete = async (id: string) => {
  await redis.del(id)
}
