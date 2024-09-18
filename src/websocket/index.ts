import { WebSocketServer } from 'ws'
import Logger from '../core/Logger'
import { verifyJwtToken } from '../auth/JWT'

const wss = new WebSocketServer({ noServer: true })

wss.on('connection', (ws, request) => {
  Logger.info(`New WebSocket connection established`)

  ws.on('message', (message) => {
    Logger.info(`Received message: ${message}`)
    ws.send(`Echo: ${message}`)
  })

  ws.on('close', () => {
    Logger.info('WebSocket connection closed')
  })
})

export const handleWebSocketUpgrade = (request: any, socket: any, head: any) => {
  const token = new URLSearchParams(request.url.split('?')[1]).get('token')
  Logger.warn(`Upgrade, token: ${token}`)

  if (token && verifyJwtToken(token)) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      Logger.info('WebSocket upgrade successful')
      ws.send('Welcome to the WebSocket server!')
      wss.emit('connection', ws, request)
    })
  } else {
    Logger.error('Invalid token, closing connection')
    socket.destroy()
  }
}

export default wss
