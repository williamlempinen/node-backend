import express from 'express'
import Logger from './core/Logger'
import cors from 'cors'
import rootRouter from './routes'
import { connectToDatabase } from './database'
import { connectRedis } from './cache'

const app = express()

app.use(express.json())

// TODO: create custom cors
app.use(cors())

connectToDatabase()
connectRedis()

app.use('/', rootRouter)

export default app
