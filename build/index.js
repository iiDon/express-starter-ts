"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import routers
const UserRouter_1 = __importDefault(require("./routes/UserRouter"));
const AuthRouter_1 = __importDefault(require("./routes/AuthRouter"));
const MosqueRouter_1 = __importDefault(require("./routes/MosqueRouter"));
const HalqahRouter_1 = __importDefault(require("./routes/HalqahRouter"));
// config
dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Middleware
const isAuthed_1 = __importDefault(require("./middleware/isAuthed"));
if (!process.env.PORT) {
    process.exit(1);
}
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
app.use((0, cookie_parser_1.default)());
app.use("/api/", AuthRouter_1.default);
app.use("/api/users", isAuthed_1.default, UserRouter_1.default);
app.use("/api/mosques", isAuthed_1.default, MosqueRouter_1.default);
app.use("/api/halqah", isAuthed_1.default, HalqahRouter_1.default);
