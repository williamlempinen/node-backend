"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const Conversation = {
    createConversation: zod_1.z.object({
        isGroup: zod_1.z.boolean().optional().default(false),
        participants: zod_1.z.array(zod_1.z.string().min(1)),
        groupName: zod_1.z.string().optional()
    }),
    getConversation: zod_1.z.object({
        id: zod_1.z.string().min(1)
    }),
    getConversations: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        pageNumber: zod_1.z.string().min(1).optional()
    }),
    updateMessagesAsSeen: zod_1.z.object({
        conversationId: zod_1.z.string().min(1),
        userId: zod_1.z.string().min(1)
    }),
    getConversationId: zod_1.z.object({
        oneId: zod_1.z.string().min(1),
        secId: zod_1.z.string().min(1)
    }),
    getGroupConversations: zod_1.z.object({
        userId: zod_1.z.string().min(1)
    }),
    addToGroup: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        conversationId: zod_1.z.string().min(1)
    })
};
exports.default = Conversation;
//# sourceMappingURL=schema.js.map