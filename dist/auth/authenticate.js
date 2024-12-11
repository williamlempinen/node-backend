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
const validator_1 = require('../core/validator')
const schema_1 = require('./schema')
const asyncHandler_1 = require('../core/asyncHandler')
const authUtils_1 = require('./authUtils')
const errors_1 = require('../core/errors')
const JWT_1 = require('./JWT')
const UserRepo_1 = __importDefault(require('../database/repository/UserRepo'))
const router = express_1.default.Router()
router.use(
  (0, validator_1.validator)(
    schema_1.Auth.authenticate,
    validator_1.ValidationSource.HEADERS,
    'authentication middleware'
  ),
  (0, asyncHandler_1.asyncHandler)((request, response, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const accessToken = (0, authUtils_1.getAccessToken)(request.headers.authorization)
      if (!accessToken || accessToken.length === 0)
        return next({ type: errors_1.ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' })
      const decodedToken = (0, JWT_1.verifyJwtToken)(accessToken)
      if (!decodedToken || !decodedToken.id)
        return next({ type: errors_1.ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' })
      const [user, error] = yield UserRepo_1.default.findById(decodedToken.id)
      if (error) return next({ type: errors_1.ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' })
      return next()
    })
  )
)
exports.default = router
//# sourceMappingURL=authenticate.js.map
