"use strict";
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
exports.connectRedis = exports.redis = void 0;
const redis_1 = require("redis");
const Logger_1 = __importDefault(require("../core/Logger"));
exports.redis = (0, redis_1.createClient)({
    url: process.env.REDIS_URL
});
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.redis.connect();
        Logger_1.default.info('Connected to Redis');
    }
    catch (error) {
        Logger_1.default.error(`Error connecting redis: ${error}`);
    }
});
exports.connectRedis = connectRedis;
exports.redis.on('connect', () => Logger_1.default.warn('Connecting redis'));
exports.redis.on('reconnecting', () => Logger_1.default.info('Reconnecting redis'));
exports.redis.on('error', (error) => Logger_1.default.error(`Redis Client Error:  ${error}`));
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.redis.quit();
    Logger_1.default.info('Redis client disconnected');
    process.exit(0);
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.redis.quit();
    Logger_1.default.info('Redis client disconnected');
    process.exit(0);
}));
//# sourceMappingURL=index.js.map