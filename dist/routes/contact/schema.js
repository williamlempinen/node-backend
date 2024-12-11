"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const Contact = {
    pairContact: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        contactId: zod_1.z.string().min(1)
    })
};
exports.default = Contact;
//# sourceMappingURL=schema.js.map