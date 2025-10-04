import { Router } from "express";
import { ReplenishmentController } from "../controllers/ReplenishmentController";

const replenishmentRoutes = Router();
const controller = new ReplenishmentController();

// Test endpoint
replenishmentRoutes.get("/test", (req, res) => controller.test(req, res));

export default replenishmentRoutes;
