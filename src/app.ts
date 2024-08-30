import express from 'express'
import Logger from './core/Logger'
import cors from 'cors'
import rootRouter from './routes'
import { connectToDatabase } from './database'
import { connectRedis } from './cache'
import errorMiddleware from './core/errorMiddleware'
import { deleteExpiredRefreshTokens } from './core/accessUtils'

const app = express()

app.use(express.json())

// TODO: create custom cors
app.use(cors())

connectToDatabase()
connectRedis()

app.use('/', rootRouter)

deleteExpiredRefreshTokens()

app.use(errorMiddleware)

export default app
