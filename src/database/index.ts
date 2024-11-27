import Logger from '../core/Logger'
import { PrismaClient } from '@prisma/client'

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    },
    {
      emit: 'event',
      level: 'info'
    },
    {
      emit: 'event',
      level: 'warn'
    },
    {
      emit: 'event',
      level: 'error'
    }
  ],
  errorFormat: 'pretty'
})

export const connectToDatabase = async () => {
  try {
    await prismaClient.$connect()
    Logger.info('Connected to databse')
  } catch (error: any) {
    Logger.error(`Couldn't connect to database: ${error}`)
  }
}

prismaClient.$on('query', (event: any) => {
  //Logger.verbose(`Query: ${event.query}`)
  //Logger.verbose(`Params: ${event.params}`)
  //Logger.verbose(`Duration: ${event.duration}ms`)
})

prismaClient.$on('warn', (event) => {
  Logger.warn(event.message)
})

prismaClient.$on('error', (event) => {
  Logger.error(event.message)
})

process.on('SIGINT', async () => {
  await prismaClient.$disconnect()
  Logger.info('Prisma client disconnected')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prismaClient.$disconnect()
  Logger.info('Prisma client disconnected')
  process.exit(0)
})
