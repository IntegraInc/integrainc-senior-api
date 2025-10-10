import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { generateToken } from "../../../shared/utils/jwt";

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - password
 *             properties:
 *               user:
 *                 type: string
 *               password:
 *                 type: number
 *     responses:
 *       201:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

export class AuthController {
 private service: AuthService;

 constructor() {
  this.service = new AuthService();
 }

 async login(req: Request, res: Response) {
  const { user, password, encryption } = req.body;

  if (!user || !password) {
   return res.status(400).json({ error: "User and password are required." });
  }

  try {
   const result = await this.service.authenticate(
    user,
    password,
    encryption || 0
   );
   if (!result.success) {
    return res.status(404).json(result);
   }
   const token = generateToken(user);
   return res.json({
    success: true,
    message: "Authenticated successfully.",
    token,
   });
  } catch (error: any) {
   console.error("Login error:", error.message);
   return res
    .status(404)
    .json({ error: "Authentication failed.", details: error.message });
  }
 }
}
