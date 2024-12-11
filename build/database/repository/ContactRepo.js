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
const Logger_1 = __importDefault(require("../../core/Logger"));
const errors_1 = require("../../core/errors");
const __1 = require("..");
const UserRepo_1 = __importDefault(require("./UserRepo"));
const ContactRepo = {
    createContact(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [contactsUser, error] = yield UserRepo_1.default.findById(parseInt(data.contactId));
                if (error)
                    return [null, { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'Such a contact user does not exist' }];
                const createdContact = yield __1.prismaClient.contact.create({
                    data: {
                        user_id: parseInt(data.userId),
                        contact_id: parseInt(data.contactId),
                        username: contactsUser === null || contactsUser === void 0 ? void 0 : contactsUser.username
                    }
                });
                if (!createdContact)
                    return [null, { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'Could not create contact' }];
                Logger_1.default.info(`Created contact: ${createdContact}`);
                return [createdContact, null];
            }
            catch (error) {
                Logger_1.default.error(`Error occurred creating contact: ${error}`);
                return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }];
            }
        });
    },
    deleteContact(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isContactDeleted = yield __1.prismaClient.contact.delete({
                    where: {
                        user_id_contact_id: {
                            user_id: parseInt(data.userId),
                            contact_id: parseInt(data.contactId)
                        }
                    }
                });
                if (!isContactDeleted)
                    return [null, { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'Could not delete the contact' }];
                return [true, null];
            }
            catch (error) {
                Logger_1.default.error(`Error occurred deleting contact: ${error}`);
                return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }];
            }
        });
    },
    isUserContact(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundUser = yield __1.prismaClient.contact.findFirst({
                    where: {
                        OR: [
                            { user_id: parseInt(data.userId), contact_id: parseInt(data.contactId) },
                            { user_id: parseInt(data.contactId), contact_id: parseInt(data.userId) }
                        ]
                    }
                });
                Logger_1.default.info('Found user from contacts: ', JSON.stringify(foundUser));
                const isContact = !!foundUser;
                Logger_1.default.warn('Is contact: ', isContact);
                return [isContact, null];
            }
            catch (error) {
                Logger_1.default.error(`Error occurred creating contact: ${error}`);
                return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }];
            }
        });
    },
    getContacts(userId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (userId, { page = 1, limit = 10 }) {
            try {
                const skip = (page - 1) * limit;
                const totalCount = yield __1.prismaClient.contact.count({
                    where: {
                        user_id: userId
                    }
                });
                const contacts = yield __1.prismaClient.contact.findMany({
                    where: {
                        user_id: userId
                    },
                    skip: skip,
                    take: limit
                });
                if (!totalCount || !contacts) {
                    Logger_1.default.error(`Error getting contacts`);
                    return [null, { type: errors_1.ErrorType.BAD_REQUEST, errorMessage: 'Error finding contacts' }];
                }
                const totalPages = Math.ceil(totalCount / limit);
                const hasNextPage = page < totalPages;
                return [{ data: contacts, page, limit, totalCount, totalPages, hasNextPage }, null];
            }
            catch (error) {
                Logger_1.default.error(`Error finding contacts: ${error}`);
                return [null, { type: errors_1.ErrorType.INTERNAL, errorMessage: 'Internal server error' }];
            }
        });
    }
};
exports.default = ContactRepo;
//# sourceMappingURL=ContactRepo.js.map