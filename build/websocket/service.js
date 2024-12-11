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
exports.createConnectionType = exports.updateIsPresent = exports.updateIsSeen = exports.createMessage = void 0;
const Logger_1 = __importDefault(require("../core/Logger"));
const MessageRepo_1 = __importDefault(require("../database/repository/MessageRepo"));
const validator_1 = require("./validator");
const schema_1 = __importDefault(require("../routes/message/schema"));
const ConversationRepo_1 = __importDefault(require("../database/repository/ConversationRepo"));
const UserRepo_1 = __importDefault(require("../database/repository/UserRepo"));
const createMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isValid, data, error } = (0, validator_1.validator)(schema_1.default.full, JSON.parse(message));
        if (!isValid || error) {
            return { data: null, error: true };
        }
        const newMessage = {
            content: data.content,
            senderId: data.sender_id,
            conversationId: data.conversation_id
        };
        const [messageCreated, messageCreatedError] = yield MessageRepo_1.default.createMessage(newMessage);
        if (messageCreatedError) {
            return { data: null, error: true };
        }
        return { data: messageCreated, error: false };
    }
    catch (error) {
        Logger_1.default.error(`Error in creating message from websocket input`);
        return { data: null, error: true };
    }
});
exports.createMessage = createMessage;
//todo
const updateIsSeen = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversationId, id } = JSON.parse(message);
        Logger_1.default.info(`Conversation id: ${conversationId} and user id: ${id}`);
        const [isUserActive, errorUserActive] = yield UserRepo_1.default.isUserActive(id);
        if (errorUserActive) {
            return { data: null, error: true };
        }
        const [updatedAsSeen, errorUpdateMessages] = yield ConversationRepo_1.default.updateMessagesAsSeen(parseInt(conversationId), parseInt(id));
        if (errorUpdateMessages) {
            return { data: null, error: true };
        }
        return { data: updatedAsSeen, error: false };
    }
    catch (error) {
        Logger_1.default.error(`Error in updating messages as seen on new messages`);
        return { data: null, error: true };
    }
});
exports.updateIsSeen = updateIsSeen;
//todo
const updateIsPresent = (something) => __awaiter(void 0, void 0, void 0, function* () { });
exports.updateIsPresent = updateIsPresent;
const createConnectionType = (webSocket) => {
    const rnd = Math.random().toString(36).substr(2, 9);
    return { ws: webSocket, id: rnd };
};
exports.createConnectionType = createConnectionType;
//# sourceMappingURL=service.js.map