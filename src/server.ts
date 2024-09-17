import app from './app'
import { port } from './config'
import Logger from './core/Logger'
import { createServer } from 'http'
import wss from './websocket'
import { verifyJwtToken } from './auth/JWT'

const server = createServer(app)

wss.on('connection', (ws) => {
  Logger.info('WebSocket connection established')

  ws.on('message', (message) => {
    Logger.info(`Received WebSocket message: ${message}`)
    ws.send(`Echo: ${message}`)
  })
})

server.on('upgrade', (request, socket, head) => {
  const token = new URLSearchParams(request?.url?.split('?')[1]).get('token')

  if (token && verifyJwtToken(token)) {
    Logger.info('Valid token, upgrading connection to WebSocket')
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  } else {
    Logger.error('Invalid token, rejecting WebSocket connection')
    socket.destroy()
  }
})
server.listen(port, () => {
  Logger.info(`Server running on port ${port}`)
})
