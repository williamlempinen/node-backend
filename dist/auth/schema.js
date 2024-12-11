'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.Auth = void 0
const zod_1 = require('zod')
exports.Auth = {
  authenticate: zod_1.z
    .object({
      authorization: zod_1.z.string().regex(/^Bearer\s[\w-]*\.[\w-]*\.[\w-]*$/, 'Invalid Authorization header format')
    })
    .passthrough(),
  validate: zod_1.z.object({
    sessionId: zod_1.z.string().min(1)
  })
}
//# sourceMappingURL=schema.js.map
