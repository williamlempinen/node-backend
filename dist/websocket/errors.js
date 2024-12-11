'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.handleWebSocketError = exports.WebSocketError = void 0
const Logger_1 = __importDefault(require('../core/Logger'))
const responses_1 = require('./responses')
var WebSocketError
;(function (WebSocketError) {
  WebSocketError['CONNECTION_ERROR'] = 'ConnectionError'
  WebSocketError['MESSAGE_ERROR'] = 'MessageError'
  WebSocketError['VALIDATION_ERROR'] = 'ValidationError'
  WebSocketError['AUTHENTICATION_ERROR'] = 'AuthenticationError'
  WebSocketError['FORBIDDEN'] = 'ForbiddenError'
  WebSocketError['NOT_FOUND'] = 'NotFoundError'
  WebSocketError['INTERNAL_ERROR'] = 'InternalError'
})(WebSocketError || (exports.WebSocketError = WebSocketError = {}))
const handleWebSocketError = (ws, errorType, message) => {
  Logger_1.default.error(`[WebSocketError]: ${errorType} - ${message}`)
  ws.send((0, responses_1.WebSocketErrorResponse)(errorType, message))
}
exports.handleWebSocketError = handleWebSocketError
//# sourceMappingURL=errors.js.map
