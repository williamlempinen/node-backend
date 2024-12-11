'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.WebSocketSuccessResponse = exports.WebSocketErrorResponse = void 0
const WebSocketErrorResponse = (errorType, message) => {
  return JSON.stringify({
    type: 'error',
    errorType,
    message
  })
}
exports.WebSocketErrorResponse = WebSocketErrorResponse
const WebSocketSuccessResponse = (message, data = null) => {
  return JSON.stringify({
    type: 'success',
    message,
    data
  })
}
exports.WebSocketSuccessResponse = WebSocketSuccessResponse
//# sourceMappingURL=responses.js.map
