"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = require("./database");
const cache_1 = require("./cache");
const errorMiddleware_1 = __importDefault(require("./core/errorMiddleware"));
const authUtils_1 = require("./auth/authUtils");
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000' // development
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ----------- CONNECTIONS -------------
(0, database_1.connectToDatabase)();
(0, cache_1.connectRedis)();
// -------------------------------------
// ------------- ROUTER ----------------
app.use('/', routes_1.default);
// -------------------------------------
setInterval(authUtils_1.deleteExpiredRefreshTokens, 60 * 60 * 100);
app.use(errorMiddleware_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map