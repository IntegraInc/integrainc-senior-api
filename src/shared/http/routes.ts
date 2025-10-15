import { Router } from "express";
import replenishmentRoutes from "../../modules/replenishment/routes/replenishment.routes";
import authRoutes from "../../modules/auth/routes/auth.routes";
import { authenticateBearer } from "./middlewares/authMiddleware";
import productsRoutes from "../../modules/products/routes/products.routes";
import filterRoutes from "../../modules/filters/routes/filter.routes";

const routes = Router();

routes.use("/products", authenticateBearer, productsRoutes);
routes.use("/replenishment", authenticateBearer, replenishmentRoutes);
routes.use("/utils", authenticateBearer, filterRoutes);
routes.use("/auth", authRoutes);

export default routes;
