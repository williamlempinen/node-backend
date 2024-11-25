import { WebSocketError } from './errors'

export const WebSocketErrorResponse = (errorType: WebSocketError, message: string) => {
  return JSON.stringify({
    type: 'error',
    errorType,
    message
  })
}

export const WebSocketSuccessResponse = (message: string, data: any = null) => {
  return JSON.stringify({
    type: 'success',
    message,
    data
  })
}
