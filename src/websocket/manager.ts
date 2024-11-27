import Logger from '../core/Logger'
import { WebSocket } from 'ws'
import { WebSocketClient } from 'types'

const ConnectionManager = (() => {
  const connectionMap = new Map<string, Set<WebSocketClient>>()

  const addConnection = (conversationId: string, client: WebSocketClient) => {
    if (!conversationId) return

    if (!connectionMap.has(conversationId)) {
      Logger.info(`Creating new entry for conversation ID: ${conversationId}`)
      connectionMap.set(conversationId, new Set())
    }

    const clients = getConnections(conversationId)
    if (!clients) return

    // DEBUG
    if ([...clients].some((c) => c.id === client.id)) {
      Logger.warn(`Duplicate client ID detected for conversation ID: ${conversationId}`)
      return
    }

    clients.add(client)

    // DEBUG
    logAllClientIds()
  }

  const removeConnection = (conversationId: string, clientId: string) => {
    const clients = getConnections(conversationId)
    if (!clients) return

    const clientToRemove = [...clients].find((c) => c.id === clientId)

    if (clientToRemove) {
      clients.delete(clientToRemove)
      Logger.info(`Removed connection with ID ${clientId} for conversation ID: ${conversationId}`)
    } else {
      Logger.warn(`Client with ID ${clientId} not found for conversation ID: ${conversationId}`)
    }

    if (clients.size === 0) {
      connectionMap.delete(conversationId)
      Logger.info(`Deleted conversation ID: ${conversationId} from connectionMap`)
    }

    // DEBUG
    logAllClientIds()
  }

  const sendMessage = (conversationId: string, message: string, senderId: string) => {
    const clients = getConnections(conversationId)
    if (!clients) return

    Logger.info(`Broadcasting to ${clients.size} clients in conversation ID: ${conversationId}`)
    for (const c of clients) {
      if (c.id !== senderId && c.ws.readyState === WebSocket.OPEN) {
        c.ws.send(message)
      }
    }

    // DEBUG
    logAllClientIds()
  }

  const getConnections = (conversationId: string): Set<WebSocketClient> | undefined => {
    return connectionMap.get(conversationId)
  }

  const logAllClientIds = () => {
    const allClients = [...connectionMap.entries()].map(([conversationId, clients]) => {
      const clientIds = [...clients].map((client) => client.id)
      return {
        conversationId,
        clientIds
      }
    })

    Logger.info(`All connected clients: ${JSON.stringify(allClients, null, 2)}`)
  }

  return {
    connectionMap,
    addConnection,
    removeConnection,
    sendMessage,
    getConnections
  }
})()

export default ConnectionManager
