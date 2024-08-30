import dotenv from 'dotenv'
dotenv.config()

export const port = process.env.PORT || 8000

export const JWT_SECRET = process.env.JWT_SECRET!
