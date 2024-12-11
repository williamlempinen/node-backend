"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const zod_1 = require("zod");
const Logger_1 = __importDefault(require("../core/Logger"));
const validator = (schema, payload) => {
    try {
        Logger_1.default.warn(`[validator try]: PAYLOAD: ${JSON.stringify(payload)}`);
        const validatedData = schema.parse(payload);
        return { isValid: true, data: validatedData };
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            Logger_1.default.error('[validator catch, zod]: Invalid data provided in WebSocket validator');
            Logger_1.default.error(`[validator catch, zod]: Validation Errors: ${JSON.stringify(error.errors)}`);
            return { isValid: false, error: error.errors };
        }
        Logger_1.default.error('[validator catch, !zod]: Unexpected error in WebSocket validator');
        throw error;
    }
};
exports.validator = validator;
//# sourceMappingURL=validator.js.map