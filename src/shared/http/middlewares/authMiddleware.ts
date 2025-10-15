import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwt";
import { redis } from "../../../config/redis";
import CryptoJS from "crypto-js";

const CRED_KEY = process.env.CRED_KEY || "";

/**
 * Middleware to authenticate requests using a Bearer JWT token.
 *
 * 1️⃣ Extracts and verifies the token
 * 2️⃣ Decodes the username from the payload
 * 3️⃣ Fetches and decrypts the corresponding Senior password from Redis
 * 4️⃣ Attaches { username, password } to req.user for downstream access
 */
export async function authenticateBearer(
 req: Request,
 res: Response,
 next: NextFunction
) {
 try {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
   return res.status(401).json({
    success: false,
    message:
     "Missing or invalid Authorization header. Contact Support on suporteintegrainc@gmail.com",
   });
  }

  const token = authHeader.split(" ")[1];
  const { valid, payload } = verifyToken(token);

  if (!valid || !payload?.username) {
   return res.status(401).json({
    success: false,
    message: "Invalid or expired token.",
   });
  }

  const username = payload.username;

  // 🔍 Busca senha criptografada no Redis
  const encrypted = await redis.get(`senior:${username}`);
  if (!encrypted) {
   return res.status(401).json({
    success: false,
    message: "Senior credentials not found or expired. Please login again.",
   });
  }

  // 🔐 Descriptografa a senha com CRED_KEY
  const password = CryptoJS.AES.decrypt(encrypted, CRED_KEY).toString(
   CryptoJS.enc.Utf8
  );

  // ✅ Injeta no request para uso posterior nos controllers
  (req as any).user = { username, password };

  next();
 } catch (error: any) {
  console.error("Auth error:", error.message);
  return res.status(401).json({
   success: false,
   message: "Unauthorized access or invalid token.",
   details: error.message,
  });
 }
}
