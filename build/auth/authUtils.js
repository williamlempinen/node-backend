"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = exports.generateSessionId = exports.deleteExpiredRefreshTokens = exports.createTokens = exports.checkPasswordHash = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importStar(require("crypto"));
const JWT_1 = require("./JWT");
const RefreshTokenRepo_1 = __importDefault(require("../database/repository/RefreshTokenRepo"));
const database_1 = require("../database");
const Logger_1 = __importDefault(require("../core/Logger"));
const hashPassword = (password) => {
    const rounds = 10;
    const s = bcrypt_1.default.genSaltSync(rounds);
    return bcrypt_1.default.hashSync(password, s);
};
exports.hashPassword = hashPassword;
const checkPasswordHash = (password, hash) => {
    return bcrypt_1.default.compareSync(password, hash);
};
exports.checkPasswordHash = checkPasswordHash;
const createTokens = (userDTO) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = (0, JWT_1.createJwtToken)(userDTO, '1h');
    const refreshToken = crypto_1.default.randomBytes(64).toString('hex');
    // error handled in repos
    yield RefreshTokenRepo_1.default.create(userDTO.id, refreshToken);
    return { accessToken, refreshToken };
});
exports.createTokens = createTokens;
const deleteExpiredRefreshTokens = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        Logger_1.default.info('Running checks');
        const expiredTokens = yield database_1.prismaClient.refreshToken.findMany({
            where: {
                expires_at: {
                    lt: now
                }
            },
            select: {
                user_id: true
            }
        });
        if (expiredTokens.length === 0) {
            Logger_1.default.info('No expired refresh tokens found.');
            return;
        }
        const userIds = Array.from(new Set(expiredTokens.map((token) => token.user_id)));
        const inactiveUsersWithExpiredTokens = yield database_1.prismaClient.user.findMany({
            where: {
                id: {
                    in: userIds
                },
                is_active: false
            },
            select: {
                id: true
            }
        });
        const inactiveUserIds = inactiveUsersWithExpiredTokens.map((user) => user.id);
        if (inactiveUserIds.length === 0) {
            Logger_1.default.info('No inactive users found with expired refresh tokens.');
            return;
        }
        const deleteResult = yield database_1.prismaClient.refreshToken.deleteMany({
            where: {
                user_id: {
                    in: inactiveUserIds
                }
            }
        });
        if (deleteResult.count > 0) {
            Logger_1.default.info(`Updated ${userIds.length} users' and deleted ${deleteResult.count} expired refresh tokens.`);
        }
    }
    catch (error) {
        Logger_1.default.error(`Failed to delete expired refresh tokens: ${error.message}`);
    }
});
exports.deleteExpiredRefreshTokens = deleteExpiredRefreshTokens;
// TODO: implement sessions for client
const generateSessionId = () => {
    return (0, crypto_1.randomBytes)(16).toString('hex');
};
exports.generateSessionId = generateSessionId;
const getAccessToken = (authorization) => {
    if (!authorization)
        return '';
    if (!authorization.startsWith('Bearer '))
        return '';
    return authorization.split(' ')[1];
};
exports.getAccessToken = getAccessToken;
//# sourceMappingURL=authUtils.js.map