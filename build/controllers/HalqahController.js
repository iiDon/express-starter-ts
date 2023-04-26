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
exports.deleteHalaqah = exports.updateHalaqah = exports.createHalaqah = exports.getHalaqah = exports.getAllHalaqah = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const getAllHalaqah = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.user.role !== "ADMIN")
        return res.status(401).json({ Error: "Sorry you are not admin" });
    const halaqah = yield client_1.default.halaqah.findMany();
    res.status(200).json(halaqah);
});
exports.getAllHalaqah = getAllHalaqah;
const getHalaqah = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.user.role !== "ADMIN")
        return res.status(401).json({ Error: "Sorry you are not admin " });
    if (!res.locals.user.mosqueId)
        return res.status(404).json({ Error: "Mosque not found" });
    const halaqah = yield client_1.default.halaqah.findUnique({
        where: { id: req.params.id },
    });
    if (!halaqah)
        return res.status(404).json({ Error: "Halaqah not found" });
    res.status(200).json(halaqah);
});
exports.getHalaqah = getHalaqah;
const createHalaqah = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { halqahName } = req.body;
    if (!halqahName)
        return res.status(400).json({ Error: "Please enter halqah name" });
    if (res.locals.user.role !== "ADMIN")
        return res.status(401).json({ Error: "Sorry you are not admin" });
    if (!res.locals.user.mosqueId)
        return res.status(404).json({ Error: "Mosque not found" });
    const halaqah = yield client_1.default.halaqah.create({
        data: {
            mosqueId: res.locals.user.mosqueId,
            name: halqahName,
        },
    });
    res.status(200).json(halaqah);
});
exports.createHalaqah = createHalaqah;
const updateHalaqah = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (res.locals.user.role !== "ADMIN")
        return res.status(401).json({ Error: "Sorry you are not admin" });
    if (!res.locals.user.mosqueId)
        return res.status(404).json({ Error: "Mosque not found" });
    if (!name)
        return res.status(400).json({ Error: "Please enter halqah name" });
    const HalaqahIdExist = yield client_1.default.halaqah.findFirst({
        where: {
            AND: [{ mosqueId: res.locals.user.mosqueId }, { id: req.params.id }],
        },
    });
    if (!HalaqahIdExist)
        return res.status(404).json({ Error: "لا يوجد حلقة بهذا الرقم" });
    const halaqah = yield client_1.default.halaqah.update({
        where: { id: HalaqahIdExist.id },
        data: {
            name: name || HalaqahIdExist.name,
        },
    });
    res.status(200).json(halaqah);
});
exports.updateHalaqah = updateHalaqah;
const deleteHalaqah = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.user.role !== "ADMIN")
        return res.status(401).json({ Error: "Sorry you are not admin" });
    const halaqahIdExist = yield client_1.default.halaqah.findUnique({
        where: { id: req.params.id },
    });
    if (!halaqahIdExist)
        return res.status(404).json({ Error: "Halqah not found" });
    const halaqah = yield client_1.default.halaqah.delete({
        where: { id: halaqahIdExist.id },
    });
    res.status(200).json(halaqah);
});
exports.deleteHalaqah = deleteHalaqah;
