import { Router } from "express";
import { NotificationController } from "../controllers/notificationController";

const notificationRoutes = Router();
const controller = new NotificationController();
// Test endpoint
notificationRoutes.get("/getNotifications", (req, res) =>
 controller.getNotifications(req, res)
);
notificationRoutes.post("/read", (req, res) =>
 controller.markNotificationAsRead(req, res)
);

export default notificationRoutes;
