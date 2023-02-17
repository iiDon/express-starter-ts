"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route = (0, express_1.Router)();
const UserController_1 = require("../controllers/UserController");
route.get("/", UserController_1.getAllUsers);
route.get("/me", UserController_1.me);
exports.default = route;
