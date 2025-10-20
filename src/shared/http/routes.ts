import { Router } from "express";
import authRoutes from "../../modules/auth/routes/auth.routes";
import { authenticateBearer } from "./middlewares/authMiddleware";
import productsRoutes from "../../modules/products/routes/products.routes";
import filterRoutes from "../../modules/filters/routes/filter.routes";

const routes = Router();

routes.use("/products", authenticateBearer, productsRoutes);
routes.use("/utils", authenticateBearer, filterRoutes);
routes.use("/auth", authRoutes);

export default routes;
