import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const authRoutes = Router();
const controller = new AuthController();

authRoutes.post("/login", (req, res) => controller.login(req, res));

export default authRoutes;
