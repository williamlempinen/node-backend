import Logger from '../core/Logger'
import { WebSocket } from 'ws'
import { WebSocketErrorResponse } from './responses'

export enum WebSocketError {
  CONNECTION_ERROR = 'ConnectionError',
  MESSAGE_ERROR = 'MessageError',
  VALIDATION_ERROR = 'ValidationError',
  AUTHENTICATION_ERROR = 'AuthenticationError',
  FORBIDDEN = 'ForbiddenError',
  NOT_FOUND = 'NotFoundError',
  INTERNAL_ERROR = 'InternalError'
}

export const handleWebSocketError = (ws: WebSocket, errorType: WebSocketError, message: string) => {
  Logger.error(`[WebSocketError]: ${errorType} - ${message}`)
  ws.send(WebSocketErrorResponse(errorType, message))
}
