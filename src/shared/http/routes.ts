import { Router } from "express";
import authRoutes from "../../modules/auth/routes/auth.routes";
import { authenticateBearer } from "./middlewares/authMiddleware";
import productsRoutes from "../../modules/products/routes/products.routes";
import filterRoutes from "../../modules/filters/routes/filter.routes";
import analisysRoutes from "../../modules/analisys/routes/analisys.routes";
import notificationRoutes from "../../modules/notification/routes/notification.routes";
import webhookRoutes from "../../modules/webhook/routes/webhook.routes";

const routes = Router();

routes.use("/products", authenticateBearer, productsRoutes);
routes.use("/analisys", authenticateBearer, analisysRoutes);
routes.use("/utils", authenticateBearer, filterRoutes);
routes.use("/auth", authRoutes);
routes.use("/notifications", authenticateBearer, notificationRoutes);
routes.use("/webhook", webhookRoutes);

export default routes;
