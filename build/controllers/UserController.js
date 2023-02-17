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
exports.me = exports.getAllUsers = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.userId;
    const user = yield client_1.default.user.findUnique({ where: { id } });
    if (!user)
        return res.status(404).json({ Error: "User not found" });
    // if (user.role !== "ADMIN")
    //   return res.status(401).json({ Error: "Sorry you are not admin" });
    const users = yield client_1.default.user.findMany({
        select: {
            id: true,
            email: true,
        },
    });
    res.status(200).json(users);
});
exports.getAllUsers = getAllUsers;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = yield req.body.userId;
    if (!id)
        return res.status(404).json({ Error: "User Id not found" });
    const user = yield client_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
        },
    });
    if (!user)
        return res.status(404).json({ Error: "User not found" });
    res.status(200).json(user);
});
exports.me = me;
