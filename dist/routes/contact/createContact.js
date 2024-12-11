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
const asyncHandler_1 = require('../../core/asyncHandler')
const schema_1 = __importDefault(require('./schema'))
const ContactRepo_1 = __importDefault(require('../../database/repository/ContactRepo'))
const responses_1 = require('../../core/responses')
const authenticate_1 = __importDefault(require('../../auth/authenticate'))
const router = express_1.default.Router()
router.use('/', authenticate_1.default)
router.post(
  '/create-contact',
  (0, validator_1.validator)(schema_1.default.pairContact),
  (0, asyncHandler_1.asyncHandler)((request, response, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const [isAlreadyContacts, error] = yield ContactRepo_1.default.isUserContact(request.body)
      if (error) return next({ type: error.type, message: error.errorMessage })
      if (isAlreadyContacts)
        return (0, responses_1.SuccessResponse)('User is already in your contacts', response, isAlreadyContacts)
      const [addUserToContacts, errorAdding] = yield ContactRepo_1.default.createContact(request.body)
      if (errorAdding) return next({ type: errorAdding.type, message: errorAdding.errorMessage })
      return (0, responses_1.SuccessResponse)('User added to your contacts', response, addUserToContacts)
    })
  )
)
exports.default = router
//# sourceMappingURL=createContact.js.map
