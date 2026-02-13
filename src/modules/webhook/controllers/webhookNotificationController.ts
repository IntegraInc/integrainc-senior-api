import { Request, Response } from "express";
import { redis } from "../../../config/redis";
import { randomUUID } from "crypto";

export class WebhookController {
 /**
  * @swagger
  * /webhook/sendNotification:
  *   post:
  *     summary: Recebe notificação do Senior
  *     description: |
  *       Endpoint chamado pelo Senior para registrar uma notificação
  *       para um usuário do Portal. A notificação é armazenada no Redis
  *       na chave `notif:{username}`.
  *     tags:
  *       - Webhook
  *     parameters:
  *       - in: header
  *         name: x-webhook-secret
  *         required: true
  *         schema:
  *           type: string
  *         description: Segredo configurado no env (WEBHOOK_SECRET)
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - username
  *               - message
  *             properties:
  *               username:
  *                 type: string
  *                 example: portal
  *               type:
  *                 type: string
  *                 example: OC_GERADA
  *               message:
  *                 type: string
  *                 example: Ordem de Compra 4567 gerada com sucesso
  *               metadata:
  *                 type: object
  *                 additionalProperties: true
  *                 example:
  *                   numeroOc: 4567
  *                   codEmp: 1
  *     responses:
  *       200:
  *         description: Notificação registrada com sucesso
  *         content:
  *           application/json:
  *             example:
  *               success: true
  *       401:
  *         description: Webhook não autorizado
  *         content:
  *           application/json:
  *             example:
  *               success: false
  *               message: Unauthorized webhook
  *       400:
  *         description: Payload inválido
  *       500:
  *         description: Erro interno
  */

 async receiveNotification(req: Request, res: Response) {
  try {
   const secret = req.headers["x-webhook-secret"];
   if (secret !== process.env.WEBHOOK_SECRET) {
    return res
     .status(401)
     .json({ success: false, message: "Unauthorized webhook" });
   }

   const { username, type, message, metadata } = req.body;

   if (!username || !message) {
    return res
     .status(400)
     .json({ success: false, message: "Invalid payload" });
   }

   const notif = {
    id: randomUUID(),
    type: type || "INFO",
    message,
    metadata: metadata || {},
    read: false,
    createdAt: new Date().toISOString(),
   };

   const key = `notif:${username}`;

   await redis.lpush(key, JSON.stringify(notif));
   await redis.ltrim(key, 0, 49); // mantém 50 últimas
   await redis.expire(key, 60 * 60 * 24 * 7); // 7 dias

   return res.status(200).json({ success: true });
  } catch (error: any) {
   console.error("Webhook notification error:", error?.message || error);
   return res.status(500).json({ success: false, message: "Internal error" });
  }
 }
}
