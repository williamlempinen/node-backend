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
const __1 = require('..')
const Logger_1 = __importDefault(require('../../core/Logger'))
const errors_1 = require('../../core/errors')
const constants_1 = require('../../constants')
const RefreshTokenRepo = {
  create(userId, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const existingToken = yield __1.prismaClient.refreshToken.findFirst({
          where: {
            user_id: userId
          }
        })
        if (existingToken) {
          const [isDeleted, error] = yield RefreshTokenRepo.deleteByUserId(userId)
          if (error) {
            Logger_1.default.error('Error deleting existing user refreshtoken')
            return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
          }
          Logger_1.default.info('Old existing refreshtoken deleted')
        }
        const token = yield __1.prismaClient.refreshToken.create({
          data: {
            user: { connect: { id: userId } },
            token_hash: refreshToken,
            expires_at: new Date(Date.now() + constants_1.HOUR_NUM)
          }
        })
        if (!token)
          return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Error creating new refresh token' }]
        return [token, null]
      } catch (error) {
        Logger_1.default.error(`Error creating refresh token: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  findByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const refreshToken = yield __1.prismaClient.refreshToken.findFirst({ where: { user_id: userId } })
        if (!refreshToken)
          return [null, { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'No refresh tokens with this user id' }]
        return [refreshToken, null]
      } catch (error) {
        Logger_1.default.error(`Error finding refresh token: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  deleteByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield __1.prismaClient.refreshToken.deleteMany({
          where: {
            user_id: userId
          }
        })
        return [true, null]
      } catch (error) {
        Logger_1.default.error(`Error deleting refresh token: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'internal server error' }]
      }
    })
  }
}
exports.default = RefreshTokenRepo
//# sourceMappingURL=RefreshTokenRepo.js.map
