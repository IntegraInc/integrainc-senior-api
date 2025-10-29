import { Router } from "express";
import { AnalisysController } from "../controllers/AnalisysController";

const analisysRoutes = Router();
const controller = new AnalisysController();

// Test endpoint
analisysRoutes.get("/all", (req, res) => controller.getAnalisys(req, res));
analisysRoutes.post("/buying-order", (req, res) =>
 controller.postBuyingOrder(req, res)
);

export default analisysRoutes;
