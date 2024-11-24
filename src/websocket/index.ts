import { WebSocketServer } from 'ws'
import Logger from '../core/Logger'
import { verifyJwtToken } from '../auth/JWT'
import { createMessage } from './chat/service'

const wss = new WebSocketServer({ noServer: true })

wss.on('connection', (ws, request) => {
  Logger.info(`New WebSocket connection established, your request: ${request}`)

  ws.on('message', (message) => {
    Logger.info(`Received message: ${message}, type of message: ${typeof message}`)
    createMessage(message.toString())
    ws.send(`Echo: ${message}`)
  })

  ws.on('close', () => {
    Logger.info('WebSocket connection closed')
  })

  ws.on('error', (error) => {
    Logger.error(`WebSocket error: ${error.message}`)
    ws.send(`Echo: ${error}`)
  })
})

export const handleWebSocketUpgrade = (request: any, socket: any, head: any) => {
  const token = new URLSearchParams(request.url.split('?')[1]).get('token')
  Logger.warn(`Upgrade, token: ${token}`)

  if (token && verifyJwtToken(token)) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      Logger.info('WebSocket upgrade successful')
      ws.send('Welcome to the WebSocket server!')
      ws.send(`HEAD: ${JSON.stringify(head)}`)
      wss.emit('connection', ws, request)
    })
  } else {
    Logger.error('Invalid token, closing connection')
    socket.destroy()
  }
}

export default wss
