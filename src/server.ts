import app from './app'
import { port } from './config'
import Logger from './core/Logger'
import { createServer } from 'http'
import wss, { handleWebSocketUpgrade } from './websocket'
import { verifyJwtToken } from './auth/JWT'

const server = createServer(app)

server.listen(port, () => {
  Logger.info(`Server running on port ${port}`)
})

server.on('error', (e) => Logger.error(`Server root error: ${e}`))

server.on('upgrade', handleWebSocketUpgrade)
