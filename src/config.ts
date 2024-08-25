import dotenv from 'dotenv'
dotenv.config()

const ENV = process.env

export const port = ENV.PORT || 8000
