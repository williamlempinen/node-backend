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
exports.redisDelete = exports.redisGet = exports.redisSet = void 0
const _1 = require('.')
const Logger_1 = __importDefault(require('../core/Logger'))
const redisSet = (id, data, expires) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield _1.redis.set(id, data, {
        EX: expires
      })
    } catch (error) {
      Logger_1.default.error(`Error setting value in redis: ${error}`)
    }
  })
exports.redisSet = redisSet
const redisGet = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const data = yield _1.redis.get(id)
      Logger_1.default.warn(`REDIS: ${data}`)
      return data
    } catch (error) {
      Logger_1.default.error(`Error getting value in redis: ${error}`)
      return null
    }
  })
exports.redisGet = redisGet
const redisDelete = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield _1.redis.del(id)
    } catch (error) {
      Logger_1.default.error(`Error deleting value in redis: ${error}`)
    }
  })
exports.redisDelete = redisDelete
//# sourceMappingURL=repository.js.map
