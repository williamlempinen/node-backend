import Logger from '../core/Logger'
import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient({
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

Logger.info('Connected to databse')

prismaClient.$on('query', (event: any) => {
  Logger.debug(`Query: ${event.query}`)
  Logger.debug(`Params: ${event.params}`)
  Logger.debug(`Duration: ${event.duration}ms`)
})

prismaClient.$on('info', (event) => {
  Logger.info(event.message)
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

export default prismaClient
