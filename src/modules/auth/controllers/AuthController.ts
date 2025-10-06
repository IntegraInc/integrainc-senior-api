import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

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
   return res.json(result);
  } catch (error: any) {
   console.error("Login error:", error.message);
   return res.status(404).json({ error: "Authentication failed." });
  }
 }
}
