'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.validator = exports.ValidationSource = void 0
const zod_1 = require('zod')
const responses_1 = require('./responses')
const Logger_1 = __importDefault(require('./Logger'))
var ValidationSource
;(function (ValidationSource) {
  ValidationSource['BODY'] = 'body'
  ValidationSource['QUERY'] = 'query'
  ValidationSource['PARAMS'] = 'params'
  ValidationSource['HEADERS'] = 'headers'
})(ValidationSource || (exports.ValidationSource = ValidationSource = {}))
const validator = (schema, source = ValidationSource.BODY, where) => {
  return (request, response, next) => {
    try {
      //Logger.warn(`[validator try]: SOURCE: ${source}, PAYLOAD: ${JSON.stringify(request[source])}`)
      {
        where && Logger_1.default.info(`FROM WHERE: ${where}`)
      }
      schema.parse(request[source])
      next()
    } catch (error) {
      if (error instanceof zod_1.ZodError) {
        Logger_1.default.error('[validator catch, zod]: Invalid data provided in validator')
        Logger_1.default.error(`[validator catch, zod]: Request in validator: ${JSON.stringify(request[source])}`)
        if (source === ValidationSource.HEADERS) {
          return (0, responses_1.AuthFailureResponse)('Unauthorized', response)
        }
        return (0, responses_1.BadRequestResponse)('Invalid data provided', response)
      }
      Logger_1.default.error('[validator catch, !zod]: Error in validator')
      return next(error)
    }
  }
}
exports.validator = validator
//# sourceMappingURL=validator.js.map
