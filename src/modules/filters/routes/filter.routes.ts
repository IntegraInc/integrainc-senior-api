import { Router } from "express";
import { FilterController } from "../controllers/FilterController";

const filterRoutes = Router();
const controller = new FilterController();

filterRoutes.get("/filters", (req, res) => controller.getFilters(req, res));
filterRoutes.get("/filters/table-price", (req, res) =>
 controller.getFiltersTablePrice(req, res)
);
filterRoutes.post("/filters/refresh", (req, res) =>
 controller.refreshRedis(req, res)
);

export default filterRoutes;
