"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const authRoutes = (0, express_1.Router)();
const controller = new AuthController_1.AuthController();
authRoutes.post("/login", (req, res) => controller.login(req, res));
exports.default = authRoutes;
