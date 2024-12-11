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
const authUtils_1 = require('../../auth/authUtils')
const errors_1 = require('../../core/errors')
const RefreshTokenRepo_1 = __importDefault(require('./RefreshTokenRepo'))
const repository_1 = require('../../cache/repository')
const constants_1 = require('../../constants')
const UserRepo = {
  // USE ONLY IN THIS SCOPE
  findByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const user = yield __1.prismaClient.user.findUnique({ where: { email: email }, include: { contacts: true } })
        if (!user) return null
        return user
      } catch (error) {
        Logger_1.default.error(`Error finding user: ${error}`)
        return null
      }
    })
  },
  findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const user = yield __1.prismaClient.user.findUnique({ where: { id: id }, include: { contacts: true } })
        if (!user) return [null, { type: errors_1.ErrorType.NOT_FOUND, errorMessage: `No user found with id: ${id}` }]
        const userDTO = UserRepo.userToDTO(user, user.contacts)
        return [userDTO, null]
      } catch (error) {
        Logger_1.default.error(`Error finding user by id: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  // this is testing
  //async findAll(): Promise<RepoResponse<UserDTO[]>> {
  //  try {
  //    const allUsers = await prisma.user.findMany({ include: { contacts: true } })
  //    const userDTOs: UserDTO[] = allUsers
  //      .map((user) => UserRepo.userToDTO(user, user.contact))
  //      .filter((userDTO) => userDTO !== null)
  //
  //    return [[], null]
  //  } catch (error: any) {
  //    Logger.error(`Error occured while finding all users: ${error}`)
  //    return [null, { type: ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
  //  }
  //},
  registerUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const exists = yield UserRepo.findByEmail(data.email)
        if (exists)
          return [
            null,
            { type: errors_1.ErrorType.NOT_FOUND, errorMessage: `User with email: ${data.email} already exists` }
          ]
        const hashedPassword = (0, authUtils_1.hashPassword)(data.password)
        const user = yield __1.prismaClient.user.create({
          data: Object.assign(Object.assign({}, data), { password: hashedPassword })
        })
        if (!user) return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Could not create new user' }]
        const userDTO = UserRepo.userToDTO(user, [])
        const { accessToken, refreshToken } = yield (0, authUtils_1.createTokens)(userDTO)
        if (!accessToken || !refreshToken)
          return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Could not create tokens' }]
        return [{ user: userDTO, accessToken, refreshToken }, null]
      } catch (error) {
        Logger_1.default.error(`Error registering new user: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  login(data) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const user = yield UserRepo.findByEmail(data.email)
        if (!user) {
          Logger_1.default.error(`No user found with email: ${data.email}`)
          return [null, { type: errors_1.ErrorType.NOT_FOUND, errorMessage: `No user found with email ${data.email}` }]
        }
        const isPasswordCorrect = (0, authUtils_1.checkPasswordHash)(data.password, user.password)
        if (!isPasswordCorrect) {
          Logger_1.default.error('Password incorrect')
          return [null, { type: errors_1.ErrorType.UNAUTHORIZED, errorMessage: 'Password incorrect' }]
        }
        const userDTO = UserRepo.userToDTO(user, user.contacts)
        // DO NOT HANDLE THE ERROR
        const [existingRefreshToken, error] = yield RefreshTokenRepo_1.default.findByUserId(userDTO.id)
        if (existingRefreshToken) {
          Logger_1.default.info(`Found existing refresh token: ${existingRefreshToken.token_hash}`)
          yield RefreshTokenRepo_1.default.deleteByUserId(userDTO.id)
        }
        const { accessToken, refreshToken } = yield (0, authUtils_1.createTokens)(userDTO)
        const sessionId = (0, authUtils_1.generateSessionId)()
        if (!accessToken || !refreshToken)
          return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Could not create tokens' }]
        const setStatus = yield UserRepo.updateUserIsActive(userDTO.id, true)
        if (!setStatus) {
          Logger_1.default.error('Error updating user status')
          return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Could not update user status' }]
        }
        yield (0, repository_1.redisSet)(sessionId, JSON.stringify({ accessToken, refreshToken }), constants_1.HOUR_NUM)
        return [{ user: userDTO, accessToken, refreshToken, sessionId }, null]
      } catch (error) {
        Logger_1.default.error(`Error login in user: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  // this is not used
  logout(userId) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        Logger_1.default.info('LOGGING USER OUT')
        const userLogout = yield __1.prismaClient.user.update({
          where: {
            id: userId,
            is_active: true
          },
          data: {
            is_active: false
          }
        })
        if (!userLogout) return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
        return [true, null]
      } catch (error) {
        Logger_1.default.error(`Error logout on user`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  updateUserIsActive(userId, isActive) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield __1.prismaClient.user.update({
          where: { id: userId },
          data: { is_active: isActive }
        })
        Logger_1.default.info('User active status updated')
        return true
      } catch (error) {
        Logger_1.default.error(`Error updating user active status, user id: ${userId}`)
        return null
      }
    })
  },
  findAllActiveUsers() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const activeUsers = yield __1.prismaClient.user.findMany({
          where: { is_active: true },
          include: { contacts: true }
        })
        if (!activeUsers) return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
        const userDTOs = activeUsers
          .map((user) => UserRepo.userToDTO(user, user.contacts))
          .filter((userDTO) => userDTO !== null)
        return [userDTOs, null]
      } catch (error) {
        Logger_1.default.error(`Error finding active users: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  searchUsers(_a) {
    return __awaiter(this, arguments, void 0, function* ({ searchQuery, page = 1, limit = 10 }) {
      try {
        const skip = (page - 1) * limit
        const whereClause = {
          username: { contains: searchQuery, mode: 'insensitive' }
        }
        const totalCount = yield __1.prismaClient.user.count({ where: whereClause })
        const users = yield __1.prismaClient.user.findMany({
          where: whereClause,
          skip: skip,
          take: limit
        })
        if (!users || !totalCount) {
          Logger_1.default.error('No users found')
          return [{ data: [], page: 1, limit: 10, totalCount: 0, totalPages: 0, hasNextPage: false }, null]
        }
        // contacts are returned as an empty list
        const userDTOs = users.map((user) => UserRepo.userToDTO(user, [])).filter((userDTO) => userDTO !== null)
        const totalPages = Math.ceil(totalCount / limit)
        const hasNextPage = page < totalPages
        return [{ data: userDTOs, page, limit, totalCount, totalPages, hasNextPage }, null]
      } catch (error) {
        Logger_1.default.error(`Error searching users: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  isUserActive(userId) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const isUserActive = yield __1.prismaClient.user.findFirst({
          where: {
            id: userId
          },
          select: {
            is_active: true
          }
        })
        if (!isUserActive) return [null, { type: errors_1.ErrorType.NOT_FOUND, errorMessage: 'User not found ' }]
        return [isUserActive.is_active, null]
      } catch (error) {
        Logger_1.default.error(`Error finding if user is active: ${error}`)
        return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }]
      }
    })
  },
  userToDTO(data, contacts) {
    const userDTO = {
      id: data.id,
      username: data.username,
      email: data.email,
      is_active: data.is_active,
      created_at: data.created_at,
      role: data.role,
      profile_picture_url: data.profile_picture_url,
      contacts: contacts || []
    }
    return userDTO
  }
}
exports.default = UserRepo
//# sourceMappingURL=UserRepo.js.map
