// src/modules/notifications/controllers/notificationController.ts
import { Request, Response } from "express";
import { redis } from "../../../config/redis";

export class NotificationController {
 /**
  * @swagger
  * /notifications/getNotifications:
  *   get:
  *     summary: Retorna notificações do usuário autenticado
  *     description: |
  *       Retorna a lista de notificações armazenadas no Redis
  *       para o usuário autenticado via Bearer Token.
  *     tags:
  *       - Notifications
  *     security:
  *       - bearerAuth: []
  *     responses:
  *       200:
  *         description: Lista de notificações
  *         content:
  *           application/json:
  *             example:
  *               success: true
  *               notifications:
  *                 - id: "a1b2c3"
  *                   type: "OC_GERADA"
  *                   message: "Ordem de Compra 4567 gerada"
  *                   metadata:
  *                     numeroOc: 4567
  *                   read: false
  *                   createdAt: "2026-02-12T12:00:00.000Z"
  *       401:
  *         description: Token inválido ou ausente
  *       500:
  *         description: Erro interno
  */

 async getNotifications(req: Request, res: Response) {
  try {
   const username = (req as any).user?.username;
   if (!username) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
   }

   const key = `notif:${username}`;
   const items = await redis.lrange(key, 0, -1);
   const notifications = items.map((x) => JSON.parse(x));

   return res.status(200).json({ success: true, notifications });
  } catch (error: any) {
   console.error("Get notifications error:", error?.message || error);
   return res.status(500).json({ success: false, message: "Internal error" });
  }
 }
 /**
  * @swagger
  * /notifications/read:
  *   post:
  *     summary: Marca uma notificação como lida
  *     tags:
  *       - Notifications
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - id
  *             properties:
  *               id:
  *                 type: string
  *                 example: a1b2c3
  *     responses:
  *       200:
  *         description: Notificação marcada como lida
  *       401:
  *         description: Não autorizado
  */

 async markNotificationAsRead(req: Request, res: Response) {
  try {
   const username = (req as any).user?.username;
   const { id } = req.body;

   if (!id) {
    return res.status(400).json({ success: false, message: "Missing id" });
   }

   const key = `notif:${username}`;
   const items = await redis.lrange(key, 0, -1);

   const updated = items.map((item) => {
    const parsed = JSON.parse(item);
    if (parsed.id === id) parsed.read = true;
    return JSON.stringify(parsed);
   });

   await redis.del(key);
   if (updated.length) await redis.rpush(key, ...updated);

   return res.json({ success: true });
  } catch (error: any) {
   console.error("Mark read error:", error.message);
   return res.status(500).json({ success: false });
  }
 }
}
