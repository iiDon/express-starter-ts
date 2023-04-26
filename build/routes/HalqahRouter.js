"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route = (0, express_1.Router)();
const HalqahController_1 = require("../controllers/HalqahController");
route.get("/", HalqahController_1.getAllHalaqah);
route.get("/:id", HalqahController_1.getHalaqah);
route.post("/", HalqahController_1.createHalaqah);
route.put("/:id", HalqahController_1.updateHalaqah);
route.delete("/:id", HalqahController_1.deleteHalaqah);
exports.default = route;
