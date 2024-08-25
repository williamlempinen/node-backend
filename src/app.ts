import express from 'express'
import Logger from './core/Logger'
import cors from 'cors'
import rootRouter from './routes'

const app = express()

app.use(express.json())

// TODO: create custom cors
app.use(cors())

app.use('/', rootRouter)

export default app
