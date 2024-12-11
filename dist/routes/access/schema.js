'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.Access = void 0
const zod_1 = require('zod')
exports.Access = {
  signup: zod_1.z.object({
    username: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long')
  }),
  login: zod_1.z.object({
    email: zod_1.z.string().email('Invalid email'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long')
  }),
  logout: zod_1.z.object({
    sessionId: zod_1.z.string().min(1)
  }),
  refreshToken: zod_1.z.object({
    email: zod_1.z.string().email('Invalid email'),
    id: zod_1.z.number().min(1),
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required')
  })
}
//# sourceMappingURL=schema.js.map
