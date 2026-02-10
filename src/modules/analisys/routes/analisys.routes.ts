import { Router } from "express";
import { AnalisysController } from "../controllers/AnalisysController";

const analisysRoutes = Router();
const controller = new AnalisysController();

// Test endpoint
analisysRoutes.get("/all", (req, res) => controller.getAnalisys(req, res));
analisysRoutes.get("/all-2", (req, res) => controller.getAnalisys_2(req, res));
analisysRoutes.post("/buying-order", (req, res) =>
 controller.postBuyingOrder(req, res)
);
analisysRoutes.post("/buying-order-2", (req, res) =>
 controller.postBuyingOrder_2(req, res)
);
export default analisysRoutes;
