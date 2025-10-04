import { Router } from "express";
import replenishmentRoutes from "../../modules/replenishment/routes/replenishment.routes";
import authRoutes from "../../modules/auth/routes/auth.routes";

const routes = Router();

routes.use("/replenishment", replenishmentRoutes);
routes.use("/auth", authRoutes);

export default routes;
