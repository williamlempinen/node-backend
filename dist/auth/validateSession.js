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
const express_1 = __importDefault(require("express"));
const validator_1 = require("../core/validator");
const schema_1 = require("./schema");
const asyncHandler_1 = require("../core/asyncHandler");
const Logger_1 = __importDefault(require("../core/Logger"));
const errors_1 = require("../core/errors");
const repository_1 = require("../cache/repository");
const responses_1 = require("../core/responses");
const UserRepo_1 = __importDefault(require("../database/repository/UserRepo"));
const JWT_1 = require("./JWT");
const router = express_1.default.Router();
router.post('/validate-session', (0, validator_1.validator)(schema_1.Auth.validate, validator_1.ValidationSource.BODY, 'valiate-session'), (0, asyncHandler_1.asyncHandler)((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = request.body;
    if (!sessionId) {
        Logger_1.default.error('No session id present');
        return next({ type: errors_1.ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' });
    }
    const isValidSession = yield (0, repository_1.redisGet)(sessionId);
    if (!isValidSession || !JSON.parse(isValidSession).accessToken || !JSON.parse(isValidSession).refreshToken)
        return next({ type: errors_1.ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' });
    const accessToken = JSON.parse(isValidSession).accessToken;
    const refreshToken = JSON.parse(isValidSession).refreshToken;
    const decodedToken = (0, JWT_1.verifyJwtToken)(accessToken);
    if (!decodedToken || !decodedToken.id)
        return next({ type: errors_1.ErrorType.UNAUTHORIZED, errorMessage: 'Unauthorized' });
    const [user, error] = yield UserRepo_1.default.findById(decodedToken.id);
    if (error)
        return next({ type: error.type, errorMessage: error.errorMessage });
    return (0, responses_1.SuccessResponse)('Authenticated', response, user);
})));
exports.default = router;
//# sourceMappingURL=validateSession.js.map