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
const singup_1 = __importDefault(require('./access/singup'))
const login_1 = __importDefault(require('./access/login'))
const logout_1 = __importDefault(require('./access/logout'))
const refreshToken_1 = __importDefault(require('./access/refreshToken'))
const validateSession_1 = __importDefault(require('../auth/validateSession'))
const authenticate_1 = __importDefault(require('../auth/authenticate'))
const activeUsers_1 = __importDefault(require('./users/activeUsers'))
const searchUsers_1 = __importDefault(require('./users/searchUsers'))
const createConversation_1 = __importDefault(require('./conversation/createConversation'))
const getConversations_1 = __importDefault(require('./conversation/getConversations'))
const updateConversationMessagesAsSeen_1 = __importDefault(require('./conversation/updateConversationMessagesAsSeen'))
const getConversationId_1 = __importDefault(require('./conversation/getConversationId'))
const getConversation_1 = __importDefault(require('./conversation/getConversation'))
const getGroupConversations_1 = __importDefault(require('./conversation/getGroupConversations'))
const addUserToGroup_1 = __importDefault(require('./conversation/addUserToGroup'))
const createContact_1 = __importDefault(require('./contact/createContact'))
const deleteContact_1 = __importDefault(require('./contact/deleteContact'))
const createMessage_1 = __importDefault(require('./message/createMessage'))
const getMessages_1 = __importDefault(require('./message/getMessages'))
const Logger_1 = __importDefault(require('../core/Logger'))
const rootRouter = express_1.default.Router()
rootRouter.get('/', (request, response) =>
  __awaiter(void 0, void 0, void 0, function* () {
    response.send(`Hello world in router root index.ts`)
  })
)
// ------------------ ACCESS ---------------------
rootRouter.use('/access', singup_1.default)
rootRouter.use('/access', login_1.default)
rootRouter.use('/access', logout_1.default)
rootRouter.use('/access', validateSession_1.default)
// ------- USING AUTHENTICATE MIDDLEWARE ---------
// -----------------------------------------------
rootRouter.use('/access', refreshToken_1.default)
// -----------------------------------------------
// ------------------ USERS ----------------------
rootRouter.use('/users', activeUsers_1.default)
rootRouter.use('/users', searchUsers_1.default)
// -----------------------------------------------
// --------------- CONVERSATION ------------------
rootRouter.use('/conversation', createConversation_1.default)
rootRouter.use('/conversation', getConversations_1.default)
rootRouter.use('/conversation', updateConversationMessagesAsSeen_1.default)
rootRouter.use('/conversation', getConversationId_1.default)
rootRouter.use('/conversation', getConversation_1.default)
rootRouter.use('/conversation', getGroupConversations_1.default)
rootRouter.use('/conversation', addUserToGroup_1.default)
// -----------------------------------------------
// ----------------- CONTACT ---------------------
rootRouter.use('/contact', createContact_1.default)
rootRouter.use('/contact', deleteContact_1.default)
// -----------------------------------------------
// ----------------- MESSAGE ---------------------
// ********** this is not used -> messages created with ws *********
rootRouter.use('/message', createMessage_1.default)
rootRouter.use('/message', getMessages_1.default)
// -----------------------------------------------
// -----------------------------------------------
rootRouter.use('/protected', authenticate_1.default)
rootRouter.get('/protected', authenticate_1.default, (request, response) =>
  __awaiter(void 0, void 0, void 0, function* () {
    Logger_1.default.info('REQUEST: ', JSON.stringify(request.headers))
    Logger_1.default.info('REQUEST: ', JSON.stringify(request.cookies))
    Logger_1.default.info('REQUEST: ', JSON.stringify(request.body))
    response.send(`You are authorized to see this message, ${JSON.stringify(request.body)}`)
  })
)
exports.default = rootRouter
//# sourceMappingURL=index.js.map
