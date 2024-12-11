'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.handleWebSocketUpgrade = void 0
const ws_1 = require('ws')
const Logger_1 = __importDefault(require('../core/Logger'))
const JWT_1 = require('../auth/JWT')
const service_1 = require('./service')
const errors_1 = require('./errors')
const responses_1 = require('./responses')
const manager_1 = __importDefault(require('./manager'))
const wss = new ws_1.WebSocketServer({ noServer: true })
wss.on('connection', (ws, request, conversationId) => {
  const { addConnection, sendMessage, removeConnection } = manager_1.default
  const client = (0, service_1.createConnectionType)(ws)
  addConnection(conversationId, client)
  // ---------------------------- MESSAGES -------------------------------
  ws.on('message', (message) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const { data, error } = yield (0, service_1.createMessage)(message)
      if (error) (0, errors_1.handleWebSocketError)(ws, errors_1.WebSocketError.MESSAGE_ERROR, 'Internal server error')
      if (data !== null)
        sendMessage(conversationId, (0, responses_1.WebSocketSuccessResponse)('New message', data), client.id)
    })
  )
  // ---------------------------------------------------------------------
  // ----------------------------- CLOSING -------------------------------
  ws.on('close', () => {
    // DEBUG
    Logger_1.default.info(`Connection closing for conversation ID: ${conversationId} and client: ${client.id}`)
    removeConnection(conversationId, client.id)
    Logger_1.default.info(`Connection closed for conversation ID: ${conversationId} and client: ${client.id}`)
  })
  // --------------------------------------------------------------------
  // ----------------------------- ERRORS -------------------------------
  ws.on('error', (error) => {
    Logger_1.default.error(`WebSocket error: ${error.message}`)
    removeConnection(conversationId, client.id)
    ;(0, errors_1.handleWebSocketError)(ws, errors_1.WebSocketError.CONNECTION_ERROR, 'Internal server error')
  })
  // --------------------------------------------------------------------
})
const handleWebSocketUpgrade = (request, socket, head) => {
  var _a
  try {
    const searchParams = new URLSearchParams((_a = request.url) === null || _a === void 0 ? void 0 : _a.split('?')[1])
    const token = searchParams.get('token')
    const conversationId = searchParams.get('conversation-id')
    if (!conversationId) {
      Logger_1.default.error('REQUEST IS MISSING CONVERSATION ID')
      socket.destroy()
      return
    }
    if (!token || !(0, JWT_1.verifyJwtToken)(token)) {
      Logger_1.default.error('Invalid token, closing connection')
      socket.destroy()
      return
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
      Logger_1.default.info('WebSocket upgrade successful')
      wss.emit('connection', ws, request, conversationId)
    })
  } catch (error) {
    Logger_1.default.error('Error upgrading connection: ', error)
    socket.destroy()
  }
}
exports.handleWebSocketUpgrade = handleWebSocketUpgrade
exports.default = wss
//# sourceMappingURL=index.js.map
