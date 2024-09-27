import express from 'express'
import Logger from './core/Logger'
import cors from 'cors'
import rootRouter from './routes'
import { connectToDatabase } from './database'
import { connectRedis } from './cache'
import errorMiddleware from './core/errorMiddleware'
import { deleteExpiredRefreshTokens } from './auth/authUtils'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173' // development
  })
)

app.use(express.json())

connectToDatabase()
connectRedis()

app.use('/', rootRouter)

setInterval(deleteExpiredRefreshTokens, 60 * 60 * 100)

app.use(errorMiddleware)

export default app
