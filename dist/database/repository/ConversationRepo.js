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
const UserRepo_1 = __importDefault(require('./UserRepo'))
const ConversationRepo = {
  createConversation(data) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a
      try {
        Logger_1.default.info(`Received data in repo: ${JSON.stringify(data)}`)
        let groupName = ''
        if (!data.isGroup) {
          Logger_1.default.info('Conversation is not group')
          if (data.participants.length > 2) {
            Logger_1.default.error('Conversation is not group and too many participants added')
            return [
              null,
              {
                type: errors_1.ErrorType.BAD_REQUEST,
                errorMessage: 'Private conversations can only have two participants'
              }
            ]
          }
          const [p1, e1] = yield UserRepo_1.default.findById(parseInt(data.participants[0]))
          const [p2, e2] = yield UserRepo_1.default.findById(parseInt(data.participants[1]))
          if (e1 || e2 || !p1 || !p2)
            return [
              null,
              { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'Cannot find users to create conversation' }
            ]
          const [privateConversationExists, notExists] =
            yield ConversationRepo.getPrivateConversationIdFromParticipantIds(p1.id, p2.id)
          if (privateConversationExists)
            return [null, { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'Private conversation already exists' }]
          groupName =
            (p1 === null || p1 === void 0 ? void 0 : p1.username) +
            ' <> ' +
            (p2 === null || p2 === void 0 ? void 0 : p2.username)
        }
        if (data.isGroup && !data.groupName) groupName = 'Default group name'
        const createdConversation = yield __1.prismaClient.conversation.create({
          data: {
            is_group: (_a = data.isGroup) !== null && _a !== void 0 ? _a : false,
            group_name: data.isGroup && data.groupName ? data.groupName : groupName,
            participants: {
              connect: data.participants.map((pId) => ({
                id: parseInt(pId)
              }))
            }
          },
          include: {
            messages: {
              take: 30,
              orderBy: {
                created_at: 'desc'
              }
            },
            participants: {
              select: {
                id: true,
                username: true,
                profile_picture_url: true,
                is_active: true
              }
            }
          }
        })
        if (!createdConversation)
          return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Could not create new conversation' }]
        Logger_1.default.info(`Created conversation in repo: ${JSON.stringify(createdConversation)}`)
        return [createdConversation, null]
      } catch (error) {
        Logger_1.default.error(`Error occurred: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  deleteConversation(id) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const isConversationDeleted = yield __1.prismaClient.conversation.delete({
          where: {
            id: id
          }
        })
        if (!isConversationDeleted)
          return [null, { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'Could not delete conversation' }]
        return [true, null]
      } catch (error) {
        Logger_1.default.error(`Error deleting conversation: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  getConversation(id) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const conversation = yield __1.prismaClient.conversation.findFirst({
          where: {
            id: id
          },
          include: {
            messages: {
              take: 30,
              orderBy: {
                created_at: 'desc'
              }
            },
            participants: {
              select: {
                id: true,
                username: true,
                profile_picture_url: true,
                is_active: true
              }
            }
          }
        })
        if (!conversation) return [null, { type: errors_1.ErrorType.NOT_FOUND, errorMessage: 'No conversations found' }]
        Logger_1.default.info('DATA: ', conversation.group_name)
        if (conversation === undefined) {
          Logger_1.default.info('UNDEFINED')
        }
        return [conversation, null]
      } catch (error) {
        Logger_1.default.error(`Error getting conversation: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  getConversations(userId_1, _a) {
    return __awaiter(this, arguments, void 0, function* (userId, { page = 1, limit = 20 }) {
      try {
        const skip = (page - 1) * limit
        const totalCount = yield __1.prismaClient.conversation.count({
          where: {
            participants: {
              some: { id: userId }
            }
          }
        })
        if (totalCount === 0)
          return [{ data: [], page: 1, limit: 10, totalCount: 0, totalPages: 0, hasNextPage: false }, null]
        const conversations = yield __1.prismaClient.conversation.findMany({
          where: {
            participants: {
              some: { id: userId }
            }
          },
          skip: skip,
          take: limit,
          orderBy: {
            updated_at: 'desc'
          },
          include: {
            messages: {
              take: 30,
              orderBy: {
                created_at: 'desc'
              }
            },
            participants: {
              select: {
                id: true,
                username: true,
                profile_picture_url: true,
                is_active: true
              }
            }
          }
        })
        Logger_1.default.warn('TOTAL COUNT: ', totalCount, ' CONVERSATIONS: ', conversations)
        if (!totalCount || !conversations) {
          Logger_1.default.error(`Error getting conversations`)
          return [null, { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'Error finding conversations' }]
        }
        const totalPages = Math.ceil(totalCount / limit)
        const hasNextPage = page < totalPages
        return [{ data: conversations, page, limit, totalCount, totalPages, hasNextPage }, null]
      } catch (error) {
        Logger_1.default.error(`Error finding conversations: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  updateConversationOnNewMessages(conversationId) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const updateSuccess = yield __1.prismaClient.conversation.update({
          where: {
            id: parseInt(conversationId)
          },
          data: {
            updated_at: new Date(),
            unread_count: {
              increment: 1
            }
          }
        })
        if (!updateSuccess)
          return [null, { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'Bad request for updating conversation' }]
        return [true, null]
      } catch (error) {
        Logger_1.default.error(`Error updating conversation updated_at field: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  updateMessagesAsSeen(conversationId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const updateSuccess = yield __1.prismaClient.conversation.update({
          where: {
            id: conversationId
          },
          data: {
            unread_count: 0,
            messages: {
              updateMany: {
                where: {
                  NOT: {
                    is_seen_by: {
                      has: userId
                    }
                  }
                },
                data: {
                  is_seen_by: {
                    push: userId
                  }
                }
              }
            }
          }
        })
        if (!updateSuccess)
          return [null, { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'Bad request updating messages as seen' }]
        return [true, null]
      } catch (error) {
        Logger_1.default.error(`Error occurred when updating message is_seen state: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  getPrivateConversationIdFromParticipantIds(oneId, secId) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const conversation = yield __1.prismaClient.conversation.findFirst({
          where: {
            is_group: false,
            participants: {
              every: { id: { in: [oneId, secId] } },
              none: { id: { notIn: [oneId, secId] } }
            }
          },
          select: {
            id: true
          }
        })
        // this is not error, there just does not exist a conversation
        // between these users
        if (!conversation) {
          Logger_1.default.verbose('NO CONVERSATION')
          return [null, { type: errors_1.ErrorType.NOT_FOUND, errorMessage: 'No existing conversation' }]
        }
        Logger_1.default.verbose('CONVERSATION FOUND')
        return [conversation.id, null]
      } catch (error) {
        Logger_1.default.error(`Error finding private conversation: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server  error' }]
      }
    })
  },
  getGroupConversations(userId) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const id = parseInt(userId)
        const groupConversations = yield __1.prismaClient.conversation.findMany({
          where: {
            is_group: true,
            participants: {
              some: { id: { in: [id] } }
            }
          },
          include: {
            messages: {
              take: 30,
              orderBy: {
                created_at: 'desc'
              }
            },
            participants: {
              select: {
                id: true,
                username: true,
                profile_picture_url: true,
                is_active: true
              }
            }
          }
        })
        if (!groupConversations)
          return [
            null,
            { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'Bad request for getting group conversations' }
          ]
        Logger_1.default.info('FOUND GROUP CONVERSATIONS')
        return [groupConversations, null]
      } catch (error) {
        Logger_1.default.error(`Error finding group conversations: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server  error' }]
      }
    })
  },
  addUserToGroup(userId, conversationId) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const uId = parseInt(userId)
        const cId = parseInt(conversationId)
        const isUserAdded = yield __1.prismaClient.conversation.update({
          where: {
            is_group: true,
            id: cId
          },
          data: {
            participants: {
              connect: {
                id: uId
              }
            }
          }
        })
        if (!isUserAdded)
          return [
            null,
            {
              type: errors_1.ErrorType.BAD_REQUEST,
              errorMessage: 'Bad request for adding user to a group conversation'
            }
          ]
        return [true, null]
      } catch (error) {
        Logger_1.default.error(`Error adding user to a group: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server  error' }]
      }
    })
  }
}
exports.default = ConversationRepo
//# sourceMappingURL=ConversationRepo.js.map
