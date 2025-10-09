import { Router } from "express";
import replenishmentRoutes from "../../modules/replenishment/routes/replenishment.routes";
import authRoutes from "../../modules/auth/routes/auth.routes";
import { authenticateBearer } from "./middlewares/authMiddleware";
import productsRoutes from "../../modules/products/routes/products.routes";

const routes = Router();

routes.use("/products", authenticateBearer, productsRoutes);
routes.use("/replenishment", authenticateBearer, replenishmentRoutes);
routes.use("/auth", authRoutes);

export default routes;
