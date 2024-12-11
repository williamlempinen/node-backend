"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../core/Logger"));
const ws_1 = require("ws");
const ConnectionManager = (() => {
    const connectionMap = new Map();
    const addConnection = (conversationId, client) => {
        if (!conversationId)
            return;
        if (!connectionMap.has(conversationId)) {
            Logger_1.default.info(`Creating new entry for conversation ID: ${conversationId}`);
            connectionMap.set(conversationId, new Set());
        }
        const clients = getConnections(conversationId);
        if (!clients)
            return;
        // DEBUG
        if ([...clients].some((c) => c.id === client.id)) {
            Logger_1.default.warn(`Duplicate client ID detected for conversation ID: ${conversationId}`);
            return;
        }
        clients.add(client);
        // DEBUG
        logAllClientIds();
    };
    const removeConnection = (conversationId, clientId) => {
        const clients = getConnections(conversationId);
        if (!clients)
            return;
        const clientToRemove = [...clients].find((c) => c.id === clientId);
        if (clientToRemove) {
            clients.delete(clientToRemove);
            Logger_1.default.info(`Removed connection with ID ${clientId} for conversation ID: ${conversationId}`);
        }
        else {
            Logger_1.default.warn(`Client with ID ${clientId} not found for conversation ID: ${conversationId}`);
        }
        if (clients.size === 0) {
            connectionMap.delete(conversationId);
            Logger_1.default.info(`Deleted conversation ID: ${conversationId} from connectionMap`);
        }
        // DEBUG
        logAllClientIds();
    };
    const sendMessage = (conversationId, message, senderId) => {
        const clients = getConnections(conversationId);
        if (!clients)
            return;
        Logger_1.default.info(`Broadcasting to ${clients.size} clients in conversation ID: ${conversationId}`);
        for (const c of clients) {
            if (c.id !== senderId && c.ws.readyState === ws_1.WebSocket.OPEN) {
                c.ws.send(message);
            }
        }
        // DEBUG
        logAllClientIds();
    };
    const getConnections = (conversationId) => {
        return connectionMap.get(conversationId);
    };
    const logAllClientIds = () => {
        const allClients = [...connectionMap.entries()].map(([conversationId, clients]) => {
            const clientIds = [...clients].map((client) => client.id);
            return {
                conversationId,
                clientIds
            };
        });
        Logger_1.default.info(`All connected clients: ${JSON.stringify(allClients, null, 2)}`);
    };
    return {
        connectionMap,
        addConnection,
        removeConnection,
        sendMessage,
        getConnections
    };
})();
exports.default = ConnectionManager;
//# sourceMappingURL=manager.js.map