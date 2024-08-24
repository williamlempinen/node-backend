import express from 'express'
import Logger from './core/Logger'
import cors from 'cors'
import router from './routes'

const app = express()

app.use(express.json())

// TODO: create custom cors
app.use(cors())

app.use('/', router)

export default app
