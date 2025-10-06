import { Router } from "express";
import replenishmentRoutes from "../../modules/replenishment/routes/replenishment.routes";
import authRoutes from "../../modules/auth/routes/auth.routes";
import { authenticateBearer } from "./middlewares/authMiddleware";

const routes = Router();

routes.use("/replenishment", replenishmentRoutes);
routes.use("/auth", authenticateBearer, authRoutes);

export default routes;
