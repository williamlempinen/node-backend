import express from 'express'
import Logger from './core/Logger'
import cors from 'cors'
import rootRouter from './routes'
import { connectToDatabase } from './database'
import { connectRedis } from './cache'
import errorMiddleware from './core/errorMiddleware'
import { deleteExpiredRefreshTokens } from './auth/authUtils'
import helmet from 'helmet'

const app = express()

app.use(helmet())

app.use(
  cors({
    origin: 'http://localhost:3000' // development
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ----------- CONNECTIONS -------------
connectToDatabase()
connectRedis()
// -------------------------------------

// ------------- ROUTER ----------------
app.use('/', rootRouter)
// -------------------------------------

setInterval(deleteExpiredRefreshTokens, 60 * 60 * 100)

app.use(errorMiddleware)

export default app
