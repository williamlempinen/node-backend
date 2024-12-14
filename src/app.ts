import express from 'express'
import cors from 'cors'
import rootRouter from './routes'
import { connectToDatabase } from './database'
import errorMiddleware from './core/errorMiddleware'
import { deleteExpiredRefreshTokens } from './auth/authUtils'
import helmet from 'helmet'

const app = express()

app.use(helmet())

app.use(
  cors({
    origin: [
      'http://localhost:3000', // development
      'https://zatchat.azurewebsites.net' // production
    ]
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ----------- CONNECTIONS -------------
connectToDatabase()
// -------------------------------------

// ------------- ROUTER ----------------
app.use('/', rootRouter)
// -------------------------------------

setInterval(deleteExpiredRefreshTokens, 60 * 60 * 100)

app.use(errorMiddleware)

export default app
