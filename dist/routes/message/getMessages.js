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
const express_1 = __importDefault(require('express'))
const authenticate_1 = __importDefault(require('../../auth/authenticate'))
const validator_1 = require('../../core/validator')
const asyncHandler_1 = require('../../core/asyncHandler')
const Logger_1 = __importDefault(require('../../core/Logger'))
const schema_1 = __importDefault(require('./schema'))
const MessageRepo_1 = __importDefault(require('../../database/repository/MessageRepo'))
const responses_1 = require('../../core/responses')
const router = express_1.default.Router()
router.use('/', authenticate_1.default)
// this should be modified so that
// it can get older messages (pages 2- inf.) and fetch that
// returns conversations already returns the first page
router.get(
  '/get-messages/:conversationId/:pageNumber',
  (0, validator_1.validator)(schema_1.default.getMessage, validator_1.ValidationSource.PARAMS),
  (0, asyncHandler_1.asyncHandler)((request, response, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      Logger_1.default.info('Getting messages')
      const { conversationId, pageNumber } = request.params
      const _conversationId = parseInt(conversationId)
      const _pageNumber = parseInt(pageNumber)
      const [getMessagesPage, error] = yield MessageRepo_1.default.getMessages(_conversationId, {
        page: _pageNumber,
        limit: 30
      })
      if (error) return next({ type: error.type, message: error.errorMessage })
      return (0, responses_1.SuccessResponse)('Messages fetched', response, getMessagesPage)
    })
  )
)
exports.default = router
//# sourceMappingURL=getMessages.js.map
