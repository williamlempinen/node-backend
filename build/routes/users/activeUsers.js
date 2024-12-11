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
const asyncHandler_1 = require("../../core/asyncHandler");
const UserRepo_1 = __importDefault(require("../../database/repository/UserRepo"));
const responses_1 = require("../../core/responses");
const Logger_1 = __importDefault(require("../../core/Logger"));
const authenticate_1 = __importDefault(require("../../auth/authenticate"));
const router = express_1.default.Router();
router.use('/', authenticate_1.default);
router.get('/active-users', (0, asyncHandler_1.asyncHandler)((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [activeUsers, error] = yield UserRepo_1.default.findAllActiveUsers();
    if (error)
        return next({ type: error.type, message: error.errorMessage });
    Logger_1.default.info(`Active users: ${activeUsers}`);
    return (0, responses_1.SuccessResponse)('Successfully found active users', response, activeUsers);
})));
exports.default = router;
//# sourceMappingURL=activeUsers.js.map