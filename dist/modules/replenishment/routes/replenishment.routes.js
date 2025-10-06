"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReplenishmentController_1 = require("../controllers/ReplenishmentController");
const replenishmentRoutes = (0, express_1.Router)();
const controller = new ReplenishmentController_1.ReplenishmentController();
// Test endpoint
replenishmentRoutes.get("/test", (req, res) => controller.test(req, res));
exports.default = replenishmentRoutes;
