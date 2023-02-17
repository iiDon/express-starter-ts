"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const route = (0, express_1.Router)();
route.post("/login", AuthController_1.login);
route.post("/register", AuthController_1.register);
exports.default = route;
