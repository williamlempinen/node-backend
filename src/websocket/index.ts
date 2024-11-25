import { WebSocketServer, WebSocket } from 'ws'
import Logger from '../core/Logger'
import { verifyJwtToken } from '../auth/JWT'
import { createMessage } from './chat/service'
import { validator } from './validator'
import Message from '../routes/message/schema'
import { handleWebSocketError, WebSocketError } from './errors'
import { WebSocketSuccessResponse } from './responses'

const wss = new WebSocketServer({ noServer: true })

wss.on('connection', (ws: WebSocket, request) => {
  Logger.info(`New WebSocket connection established, your request: ${request}`)

  ws.on('message', async (message) => {
    Logger.info(`Raw message received: ${message}`)
    Logger.info(`Raw stringifyed message received: ${JSON.stringify(message)}`)
    ws.send(`Echo: ${message}`)
    const { success, error } = await createMessage(message)
    if (error) {
      Logger.error(`WS got error`)
      handleWebSocketError(ws, WebSocketError.MESSAGE_ERROR, 'Internal server error')
    }

    if (success !== null) {
      ws.send(WebSocketSuccessResponse('Message sent successfully', success))
    }
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
