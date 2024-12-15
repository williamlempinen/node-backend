import dotenv from 'dotenv'
dotenv.config()

export const port = process.env.PORT!
export const DATABASE_URL = process.env.DATABASE_URL!
export const JWT_SECRET = process.env.JWT_SECRET!
//export const REDIS_HOST = process.env.REDIS_HOST!
//export const REDIS_PORT = process.env.REDIS_PORT!
//export const REDIS_URL = process.env.REDIS_URL!

export const DATABASE_URL_AZ = process.env.DATABASE_URL_AZ!
//export const REDIS_HOST_AZ = process.env.REDIS_HOST_AZ!
//export const REDIS_PORT_AZ = process.env.REDIS_PORT_AZ!
//export const REDIS_USERNAME_AZ = process.env.REDIS_USERNAME_AZ
//export const REDIS_URL_AZ = process.env.REDIS_URL_AZ!
//export const REDIS_ACCESS_KEY_PRIMARY = process.env.REDIS_ACCESS_KEY_PRIMARY!
