"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const Message = {
    createMessage: zod_1.z.object({
        content: zod_1.z.string().min(1),
        senderId: zod_1.z.string().min(1),
        conversationId: zod_1.z.string().min(1)
    }),
    getMessage: zod_1.z.object({
        conversationId: zod_1.z.string().min(1),
        pageNumber: zod_1.z.string().min(1)
    }),
    full: zod_1.z.object({
        content: zod_1.z.string().min(1),
        sender_id: zod_1.z.number().min(1),
        conversation_id: zod_1.z.number().min(1),
        id: zod_1.z.number().min(1),
        created_at: zod_1.z.string().min(1),
        is_seen: zod_1.z.boolean()
    })
};
exports.default = Message;
//# sourceMappingURL=schema.js.map