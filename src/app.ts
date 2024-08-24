import express, { Request, Response, NextFunction } from 'express'
import Logger from './core/Logger'
import cors from 'cors'

const app = express()

Logger.info('Hello world')

app.use(express.json())
app.use(cors())
app.use('/', routes)
