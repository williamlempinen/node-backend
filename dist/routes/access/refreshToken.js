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
const Logger_1 = __importDefault(require('../../core/Logger'))
const asyncHandler_1 = require('../../core/asyncHandler')
const validator_1 = require('../../core/validator')
const schema_1 = require('./schema')
const responses_1 = require('../../core/responses')
const UserRepo_1 = __importDefault(require('../../database/repository/UserRepo'))
const RefreshTokenRepo_1 = __importDefault(require('../../database/repository/RefreshTokenRepo'))
const errors_1 = require('../../core/errors')
const authUtils_1 = require('../../auth/authUtils')
const authenticate_1 = __importDefault(require('../../auth/authenticate'))
const router = express_1.default.Router()
router.use('/', authenticate_1.default)
router.post(
  '/refreshtoken',
  (0, validator_1.validator)(schema_1.Access.refreshToken),
  (0, asyncHandler_1.asyncHandler)((request, response, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const [storedToken, error] = yield RefreshTokenRepo_1.default.findByUserId(request.body.id)
      if (error) return next({ type: error.type, message: error.errorMessage })
      Logger_1.default.info(
        `Found token in DB: ${storedToken === null || storedToken === void 0 ? void 0 : storedToken.token_hash}`
      )
      Logger_1.default.info(`Token from client: ${request.body.refreshToken}`)
      if (
        (storedToken === null || storedToken === void 0 ? void 0 : storedToken.token_hash) !== request.body.refreshToken
      )
        return next({ type: errors_1.ErrorType.BAD_REQUEST, message: 'Invalid refresh token' })
      if (
        storedToken &&
        (storedToken === null || storedToken === void 0 ? void 0 : storedToken.expires_at) < new Date()
      ) {
        Logger_1.default.error('Refresh token expired')
        return next({ type: errors_1.ErrorType.BAD_REQUEST, message: 'Refresh token expired' })
      }
      if (!storedToken || !storedToken.user_id || storedToken.user_id !== request.body.id) {
        Logger_1.default.error('User id does not match')
        return next({ type: errors_1.ErrorType.BAD_REQUEST, message: 'User id does not match' })
      }
      Logger_1.default.info(
        `Found token: ${storedToken}, for user id: ${storedToken === null || storedToken === void 0 ? void 0 : storedToken.user_id}`
      )
      const [user, errorInUserRepo] = yield UserRepo_1.default.findById(
        storedToken === null || storedToken === void 0 ? void 0 : storedToken.user_id
      )
      if (errorInUserRepo) return next({ type: errorInUserRepo.type, message: errorInUserRepo.errorMessage })
      Logger_1.default.info(
        `Found user: ${user === null || user === void 0 ? void 0 : user.email}, with id: ${user === null || user === void 0 ? void 0 : user.id}`
      )
      if (!user) return next({ type: errors_1.ErrorType.NOT_FOUND, message: 'User not found' })
      const { accessToken, refreshToken } = yield (0, authUtils_1.createTokens)(user)
      yield RefreshTokenRepo_1.default.create(user.id, refreshToken)
      Logger_1.default.info(`Tokens refreshed for user: ${user.email}`)
      return (0, responses_1.RefreshTokenResponse)('Tokens refreshed', response, accessToken, refreshToken)
    })
  )
)
exports.default = router
//# sourceMappingURL=refreshToken.js.map
