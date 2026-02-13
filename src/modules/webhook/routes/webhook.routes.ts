import { Router } from "express";
import { WebhookController } from "../controllers/webhookNotificationController";

const webhookRoutes = Router();
const controller = new WebhookController();

webhookRoutes.post("/sendNotification", (req, res) =>
 controller.receiveNotification(req, res)
);

export default webhookRoutes;
