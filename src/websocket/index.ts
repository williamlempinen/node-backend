import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import Logger from '../core/Logger'
import { verifyJwtToken } from '../auth/JWT'
import { createConnectionType, createMessage } from './service'
import { handleWebSocketError, WebSocketError } from './errors'
import { WebSocketSuccessResponse } from './responses'
import { Socket } from 'net'
import ConnectionManager from './manager'

const wss = new WebSocketServer({ noServer: true })

wss.on('connection', (ws: WebSocket, request: IncomingMessage, conversationId: string) => {
  const { addConnection, sendMessage, removeConnection } = ConnectionManager

  const client = createConnectionType(ws)

  addConnection(conversationId, client)

  // ---------------------------- MESSAGES -------------------------------
  ws.on('message', async (message) => {
    const { data, error } = await createMessage(message)

    if (error) {
      handleWebSocketError(ws, WebSocketError.MESSAGE_ERROR, 'Internal server error')
    }

    if (data !== null) {
      sendMessage(conversationId, WebSocketSuccessResponse('New message', data), client.id)
    }
  })

  // ----------------------------- CLOSING -------------------------------
  ws.on('close', () => {
    // DEBUG
    Logger.info(`Connection closing for conversation ID: ${conversationId} and client: ${client.id}`)
    removeConnection(conversationId, client.id)
    Logger.info(`Connection closed for conversation ID: ${conversationId} and client: ${client.id}`)
  })

  // ----------------------------- ERRORS -------------------------------
  ws.on('error', (error) => {
    Logger.error(`WebSocket error: ${error.message}`)
    removeConnection(conversationId, client.id)
    handleWebSocketError(ws, WebSocketError.CONNECTION_ERROR, 'Internal server error')
  })
})

export const handleWebSocketUpgrade = (request: IncomingMessage, socket: Socket, head: Buffer) => {
  try {
    const searchParams = new URLSearchParams(request.url?.split('?')[1])

    const token = searchParams.get('token')
    const conversationId = searchParams.get('conversation-id')

    if (!conversationId) {
      Logger.error('REQUEST IS MISSING CONVERSATION ID')
      socket.destroy()
      return
    }

    if (!token || !verifyJwtToken(token)) {
      Logger.error('Invalid token, closing connection')
      socket.destroy()
      return
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      Logger.info('WebSocket upgrade successful')
      wss.emit('connection', ws, request, conversationId)
    })
  } catch (error: any) {
    Logger.error('Error upgrading connection: ', error)
    socket.destroy()
  }
}

export default wss
