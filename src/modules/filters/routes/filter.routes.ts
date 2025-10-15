import { Router } from "express";
import { FilterController } from "../controllers/FilterController";

const authRoutes = Router();
const controller = new FilterController();

authRoutes.get("/filters", (req, res) => controller.getFilters(req, res));
authRoutes.post("/filters/refresh", (req, res) =>
 controller.refreshRedis(req, res)
);

export default authRoutes;
