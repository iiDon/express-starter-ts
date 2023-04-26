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
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = __importDefault(require("../prisma/client"));
//  register
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = (yield req.body);
    if (!email || !password) {
        return res.status(401).json({ Error: "Sorry you have missing fields" });
    }
    const emailUsed = yield client_1.default.user.findUnique({ where: { email } });
    if (emailUsed)
        return res.status(401).json({ Error: "Sorry this mail is used " });
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    yield client_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
            mosqueId: "clefu4brr0000v9mor274gns5",
        },
    });
    res.status(201).json("You have sucessfuly registered");
});
exports.register = register;
// login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = (yield req.body);
    if (!email || !password)
        return res.status(401).json({ Error: "Sorry you have missing fields" });
    const user = yield client_1.default.user.findUnique({ where: { email } });
    if (!user) {
        return res
            .status(401)
            .json({ error: "Sorry, Email or Password is not correct" });
    }
    const isValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isValid) {
        return res
            .status(401)
            .json({ error: "Sorry, Email or Password is not correct" });
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        //   role: user.role,
    }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    return res
        .cookie("access_token", token, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
    })
        .status(200)
        .json({ message: "Logged in successfully 😊 👌" });
});
exports.login = login;
