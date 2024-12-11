"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const Logger_1 = __importDefault(require("./core/Logger"));
const http_1 = require("http");
const websocket_1 = require("./websocket");
const server = (0, http_1.createServer)(app_1.default);
server.listen(config_1.port, () => {
    Logger_1.default.info(`Server running on port ${config_1.port}`);
});
server.on('error', (e) => Logger_1.default.error(`Server root error: ${e}`));
server.on('upgrade', websocket_1.handleWebSocketUpgrade);
//# sourceMappingURL=server.js.map