"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
// const mongoServer = new MongoMemoryServer();
let mongoServer;
exports.dbConnect = async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    const mongooseOpts = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    };
    await mongoose_1.default.connect(uri, mongooseOpts);
};
exports.dbDisconnect = async () => {
    await mongoose_1.default.connection.dropDatabase();
    await mongoose_1.default.connection.close();
    await mongoServer.stop();
};
