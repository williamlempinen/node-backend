"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.createJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const Logger_1 = __importDefault(require("../core/Logger"));
const createJwtToken = (user, expiresIn = '1h') => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role
    }, config_1.JWT_SECRET, { expiresIn });
};
exports.createJwtToken = createJwtToken;
const verifyJwtToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        Logger_1.default.error(`[JWT util, verifyToken]: Error verifing token: ${error}`);
        return null;
    }
};
exports.verifyJwtToken = verifyJwtToken;
//# sourceMappingURL=JWT.js.map