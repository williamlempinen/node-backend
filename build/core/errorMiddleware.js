"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("./Logger"));
const errors_1 = require("./errors");
const errorMiddleware = (error, request, response, next) => {
    Logger_1.default.error(`Error occurred: ${error.message || error}, error middleware start`);
    if (error.type && Object.values(errors_1.ErrorType).includes(error.type)) {
        Logger_1.default.error('Error type found in error middleware');
        return (0, errors_1.handleError)(error.type, error.message || 'An error occurred', response);
    }
    return (0, errors_1.handleError)(errors_1.ErrorType.INTERNAL, 'An unexpected error occurred, error not catched from defined error types.', response);
};
exports.default = errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map