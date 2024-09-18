const connectionPool = new Map<number, WebSocket>()

export const addUserConnection = (userId: number, ws: WebSocket) => {
  connectionPool.set(userId, ws)
}

export const getConnection = (userId: number): WebSocket | undefined => {
  return connectionPool.get(userId)
}
