'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.asyncHandler = void 0
const asyncHandler = (execution) => {
  return (request, response, next) => {
    Promise.resolve(execution(request, response, next)).catch(next)
  }
}
exports.asyncHandler = asyncHandler
//# sourceMappingURL=asyncHandler.js.map
