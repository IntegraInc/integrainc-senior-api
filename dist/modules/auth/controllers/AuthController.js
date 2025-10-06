"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
class AuthController {
    constructor() {
        this.service = new AuthService_1.AuthService();
    }
    async login(req, res) {
        const { user, password, encryption } = req.body;
        if (!user || !password) {
            return res.status(400).json({ error: "User and password are required." });
        }
        try {
            const result = await this.service.authenticate(user, password, encryption || 0);
            return res.json(result);
        }
        catch (error) {
            console.error("Login error:", error.message);
            return res.status(404).json({ error: "Authentication failed." });
        }
    }
}
exports.AuthController = AuthController;
