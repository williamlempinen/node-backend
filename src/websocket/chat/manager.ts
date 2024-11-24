import Logger from '../../core/Logger'

const connectionPool = new Map<number, WebSocket>()

export const addUserConnection = (userId: number, ws: WebSocket) => {
  Logger.info('WEBSOCKET MANAGER IN ACTION')
  connectionPool.set(userId, ws)
}

export const getConnection = (userId: number): WebSocket | undefined => {
  Logger.info('WEBSOCKET MANAGER IN ACTION')
  return connectionPool.get(userId)
}
