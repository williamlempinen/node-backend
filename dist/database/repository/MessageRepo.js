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
const Logger_1 = __importDefault(require('../../core/Logger'))
const errors_1 = require('../../core/errors')
const __1 = require('..')
const ConversationRepo_1 = __importDefault(require('./ConversationRepo'))
const MessageRepo = {
  createMessage(data) {
    return __awaiter(this, void 0, void 0, function* () {
      Logger_1.default.info(`GOT DATA ${JSON.stringify(data)}`)
      try {
        const isParticipant = yield __1.prismaClient.conversation.findFirst({
          where: {
            id: parseInt(data.conversationId),
            participants: {
              some: {
                id: parseInt(data.senderId)
              }
            }
          },
          select: {
            id: true
          }
        })
        if (!isParticipant)
          return [
            null,
            { type: errors_1.ErrorType.FORBIDDEN, errorMessage: 'User is not a participant in this conversation' }
          ]
        const message = yield __1.prismaClient.message.create({
          data: {
            is_seen: false,
            sender_id: parseInt(data.senderId),
            conversation_id: parseInt(data.conversationId),
            content: data.content
          }
        })
        if (!message) return [null, { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'Could not create message' }]
        const [isConversationUpdated, error] = yield ConversationRepo_1.default.updateConversationOnNewMessages(
          data.conversationId
        )
        if (error) return [null, { type: error.type, errorMessage: error.errorMessage }]
        return [message, null]
      } catch (error) {
        Logger_1.default.error(`Error creating message: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  getMessages(conversationId_1, _a) {
    return __awaiter(this, arguments, void 0, function* (conversationId, { page, limit = 30 }) {
      try {
        if (!page) return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
        const skip = (page - 1) * limit
        const totalCount = yield __1.prismaClient.message.count({
          where: {
            conversation_id: conversationId
          }
        })
        if (totalCount === 0)
          return [{ data: [], page: 1, limit: 10, totalCount: 0, totalPages: 0, hasNextPage: false }, null]
        Logger_1.default.info('TOTAL COUNT OF MESSAGES: ', JSON.stringify(totalCount))
        const messages = yield __1.prismaClient.message.findMany({
          where: {
            conversation_id: conversationId
          },
          skip: skip,
          take: limit,
          orderBy: {
            created_at: 'desc'
          }
        })
        if (!messages || !totalCount)
          return [null, { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'Could not find messages' }]
        const totalPages = Math.ceil(totalCount / limit)
        const hasNextPage = page < totalPages
        return [{ data: messages, page, limit, totalCount, totalPages, hasNextPage }, null]
      } catch (error) {
        Logger_1.default.error(`Error getting messages: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  }
}
exports.default = MessageRepo
//# sourceMappingURL=MessageRepo.js.map
