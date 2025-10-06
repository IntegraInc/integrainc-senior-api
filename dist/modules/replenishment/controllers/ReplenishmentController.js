"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplenishmentController = void 0;
const ReplenishmentService_1 = require("../services/ReplenishmentService");
class ReplenishmentController {
    constructor() {
        this.service = new ReplenishmentService_1.ReplenishmentService();
    }
    async test(req, res) {
        try {
            const result = await this.service.testIntegration();
            return res.json({ status: "ok", data: result });
        }
        catch (error) {
            console.error("Error in test route:", error);
            return res.status(500).json({ error: "Integration test failed" });
        }
    }
}
exports.ReplenishmentController = ReplenishmentController;
