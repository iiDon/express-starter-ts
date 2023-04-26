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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const isAuthed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ error: "You do not have access" });
    }
    try {
        const userId = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield client_1.default.user.findUnique({
            where: { id: userId.userId },
            select: {
                id: true,
                mosqueId: true,
                role: true,
            },
        });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        res.locals.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Request is not authorized1" });
    }
});
exports.default = isAuthed;
