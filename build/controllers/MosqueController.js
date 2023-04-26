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
exports.deleteMosque = exports.updateMosque = exports.createMosque = exports.getMosque = exports.getAllMosque = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const getAllMosque = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.userId;
    if (res.locals.user.role !== "ADMIN")
        return res.status(401).json({ Error: "Sorry you are not admin" });
    const mosques = yield client_1.default.mosque.findMany();
    res.status(200).json(mosques);
});
exports.getAllMosque = getAllMosque;
const getMosque = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.user.role !== "ADMIN" ||
        res.locals.user.mosqueId !== req.params.id)
        return res.status(401).json({ Error: "Sorry you are not admin" });
    const mosque = yield client_1.default.mosque.findUnique({
        where: { id: res.locals.user.mosqueId },
    });
    res.status(200).json(mosque);
});
exports.getMosque = getMosque;
const createMosque = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name)
        return res.status(401).json({ Error: "Sorry you have missing fields" });
    if (res.locals.user.role !== "ADMIN")
        return res.status(401).json({ Error: "Sorry you are not admin" });
    const mosque = yield client_1.default.mosque.create({ data: { name } });
    res.status(200).json(mosque);
});
exports.createMosque = createMosque;
const updateMosque = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address } = req.body;
    if (res.locals.user.role !== "ADMIN" ||
        res.locals.user.mosqueId !== req.params.id)
        return res.status(401).json({ Error: "Sorry you are not admin" });
    const mosqueExist = yield client_1.default.mosque.findUnique({
        where: { id: res.locals.user.mosqueId },
    });
    if (!mosqueExist)
        return res.status(404).json({ Error: "Mosque not found" });
    const mosque = yield client_1.default.mosque.update({
        where: { id: res.locals.user.mosqueId },
        data: {
            name: name || mosqueExist.name,
            address: address || mosqueExist.address,
        },
    });
    res.status(200).json(mosque);
});
exports.updateMosque = updateMosque;
const deleteMosque = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.user.role !== "ADMIN")
        return res.status(401).json({ Error: "Sorry you are not admin" });
    // const mosqueExist = await prisma.mosque.findUnique({
    //   where: { id: req.params.id },
    // });
    // if (!mosqueExist) return res.status(404).json({ Error: "Mosque not found" });
    // // remove any relation with mosque
    // await prisma.user.updateMany({
    //   where: { mosqueId: req.params.id },
    //   data: { mosqueId: null },
    // });
    // await prisma.halaqah.updateMany({
    //   where: { mosqueId: req.params.id },
    //   data: { mosqueId: null },
    // });
    // const mosque = await prisma.mosque.delete({
    //   where: { id: mosqueExist.id },
    // });
    res.status(200).json("Mosque deleted");
});
exports.deleteMosque = deleteMosque;
