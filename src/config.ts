import dotenv from 'dotenv'
dotenv.config()

export const port = process.env.PORT!
export const DATABASE_URL = process.env.DATABASE_URL!
export const JWT_SECRET = process.env.JWT_SECRET!
export const REDIS_HOST = process.env.REDIS_HOST!
export const REDIS_PORT = process.env.REDIS_PORT!
export const REDIS_URL = process.env.REDIS_URL!
