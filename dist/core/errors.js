'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.handleError = exports.ErrorType = void 0
const responses_1 = require('./responses')
var ErrorType
;(function (ErrorType) {
  ErrorType['FORBIDDEN'] = 'ForbiddenError'
  ErrorType['TOKEN_EXPIRED'] = 'TokenExpiredError'
  ErrorType['UNAUTHORIZED'] = 'AuthFailureError'
  ErrorType['INTERNAL'] = 'InternalError'
  ErrorType['NOT_FOUND'] = 'NotFoundError'
  ErrorType['BAD_REQUEST'] = 'BadRequestError'
})(ErrorType || (exports.ErrorType = ErrorType = {}))
const handleError = (errorType, message, response) => {
  switch (errorType) {
    case ErrorType.FORBIDDEN:
      return (0, responses_1.ForbiddenResponse)(message, response)
    case ErrorType.TOKEN_EXPIRED:
    case ErrorType.UNAUTHORIZED:
      return (0, responses_1.AuthFailureResponse)(message, response)
    case ErrorType.INTERNAL:
      return (0, responses_1.InternalErrorResponse)(message, response)
    case ErrorType.NOT_FOUND:
      return (0, responses_1.NotFoundResponse)(message, response)
    case ErrorType.BAD_REQUEST:
      return (0, responses_1.BadRequestResponse)(message, response)
    default:
      return (0, responses_1.InternalErrorResponse)('Unexpected error occurred', response)
  }
}
exports.handleError = handleError
//# sourceMappingURL=errors.js.map
