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
const validator_1 = require('../../core/validator')
const schema_1 = __importDefault(require('./schema'))
const asyncHandler_1 = require('../../core/asyncHandler')
const Logger_1 = __importDefault(require('../../core/Logger'))
const authenticate_1 = __importDefault(require('../../auth/authenticate'))
const ConversationRepo_1 = __importDefault(require('../../database/repository/ConversationRepo'))
const responses_1 = require('../../core/responses')
const router = express_1.default.Router()
router.use('/', authenticate_1.default)
router.get(
  `/get-conversation/:id`,
  (0, validator_1.validator)(schema_1.default.getConversation, validator_1.ValidationSource.PARAMS),
  (0, asyncHandler_1.asyncHandler)((request, response, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const { id } = request.params
      Logger_1.default.info(`Get conversation for id: ${id}`)
      const [conversation, error] = yield ConversationRepo_1.default.getConversation(parseInt(id))
      if (error) return next({ type: error.type, errorMessage: error.errorMessage })
      return (0, responses_1.SuccessResponse)('Conversation id found', response, conversation)
    })
  )
)
exports.default = router
//# sourceMappingURL=getConversation.js.map
