"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateBearer = authenticateBearer;
const jwt_1 = require("../../utils/jwt");
function authenticateBearer(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({
            error: "Missing or invalid Authorization header. Contact Support on suporteintegrainc@gmail.com",
        });
    }
    const token = authHeader.split(" ")[1];
    const { valid, payload } = (0, jwt_1.verifyToken)(token);
    if (!valid) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
    // optional: attach user info to request
    req.user = payload.user;
    next();
}
