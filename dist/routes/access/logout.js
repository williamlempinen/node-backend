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
const asyncHandler_1 = require('../../core/asyncHandler')
const errors_1 = require('../../core/errors')
const responses_1 = require('../../core/responses')
const RefreshTokenRepo_1 = __importDefault(require('../../database/repository/RefreshTokenRepo'))
const validator_1 = require('../../core/validator')
const schema_1 = require('./schema')
const UserRepo_1 = __importDefault(require('../../database/repository/UserRepo'))
const repository_1 = require('../../cache/repository')
const JWT_1 = require('../../auth/JWT')
const Logger_1 = __importDefault(require('../../core/Logger'))
const router = express_1.default.Router()
router.post(
  '/logout',
  (0, validator_1.validator)(schema_1.Access.logout),
  (0, asyncHandler_1.asyncHandler)((request, response, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const { sessionId } = request.body
      if (!sessionId) return next({ type: errors_1.ErrorType.BAD_REQUEST, message: 'Session id is required' })
      const cachedData = yield (0, repository_1.redisGet)(sessionId)
      if (!cachedData) return next({ type: errors_1.ErrorType.INTERNAL, message: 'Token not found from sessions' })
      const decodedToken = (0, JWT_1.verifyJwtToken)(JSON.parse(cachedData).accessToken)
      if (!decodedToken || !decodedToken.id)
        return next({ type: errors_1.ErrorType.INTERNAL, message: 'Token not found from sessions' })
      Logger_1.default.warn('DECODED TOKEN: ', decodedToken)
      const [isRefreshTokenDeleted, error] = yield RefreshTokenRepo_1.default.deleteByUserId(decodedToken.id)
      if (error) return next({ type: error.type, message: error.errorMessage })
      const setStatus = yield UserRepo_1.default.updateUserIsActive(decodedToken.id, false)
      if (!setStatus) return next({ type: errors_1.ErrorType.INTERNAL, message: 'Error deleting refresh token' })
      Logger_1.default.warn('LOGGING OUT')
      // --------------------------------------------------------------------------
      response.clearCookie('accessToken', { httpOnly: true, sameSite: 'strict' })
      response.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' })
      ;(0, repository_1.redisDelete)(sessionId)
      // --------------------------------------------------------------------------
      return (0, responses_1.SuccessResponse)('Logout succeeded', response)
    })
  )
)
exports.default = router
//# sourceMappingURL=logout.js.map
