import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwt";

export function authenticateBearer(
 req: Request,
 res: Response,
 next: NextFunction
) {
 const authHeader = req.headers.authorization;

 if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return res
   .status(401)
   .json({
    error:
     "Missing or invalid Authorization header. Contact Support on suporteintegrainc@gmail.com",
   });
 }

 const token = authHeader.split(" ")[1];
 const { valid, payload } = verifyToken(token);

 if (!valid) {
  return res.status(401).json({ error: "Invalid or expired token." });
 }

 // optional: attach user info to request
 (req as any).user = payload.user;

 next();
}
