"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_URL = exports.REDIS_PORT = exports.REDIS_HOST = exports.JWT_SECRET = exports.DATABASE_URL = exports.port = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.port = process.env.PORT;
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.REDIS_HOST = process.env.REDIS_HOST;
exports.REDIS_PORT = process.env.REDIS_PORT;
exports.REDIS_URL = process.env.REDIS_URL;
//# sourceMappingURL=config.js.map