import { Router } from "express";
import replenishmentRoutes from "../../modules/replenishment/routes/replenishment.routes";

const routes = Router();

routes.use("/replenishment", replenishmentRoutes);

export default routes;
