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
exports.connectToDatabase = exports.prismaClient = void 0;
const Logger_1 = __importDefault(require("../core/Logger"));
const client_1 = require("@prisma/client");
exports.prismaClient = new client_1.PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query'
        },
        {
            emit: 'event',
            level: 'info'
        },
        {
            emit: 'event',
            level: 'warn'
        },
        {
            emit: 'event',
            level: 'error'
        }
    ],
    errorFormat: 'pretty'
});
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.prismaClient.$connect();
        Logger_1.default.info('Connected to databse');
    }
    catch (error) {
        Logger_1.default.error(`Couldn't connect to database: ${error}`);
    }
});
exports.connectToDatabase = connectToDatabase;
exports.prismaClient.$on('query', (event) => {
    //Logger.verbose(`Query: ${event.query}`)
    //Logger.verbose(`Params: ${event.params}`)
    //Logger.verbose(`Duration: ${event.duration}ms`)
});
exports.prismaClient.$on('warn', (event) => {
    Logger_1.default.warn(event.message);
});
exports.prismaClient.$on('error', (event) => {
    Logger_1.default.error(event.message);
});
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.prismaClient.$disconnect();
    Logger_1.default.info('Prisma client disconnected');
    process.exit(0);
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.prismaClient.$disconnect();
    Logger_1.default.info('Prisma client disconnected');
    process.exit(0);
}));
//# sourceMappingURL=index.js.map