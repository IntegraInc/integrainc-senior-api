import jwt from "jsonwebtoken";
require("dotenv/config");

const JWT_SECRET = process.env.JWT_SECRET || ""; // ⚠️ set real secret in .env

export function generateToken(username: string) {
 return jwt.sign({ user: username }, JWT_SECRET, {
  expiresIn: "8h",
  issuer: "PortalPlenitude",
 });
}

export function verifyToken(token: string): { valid: boolean; payload?: any } {
 try {
  const decoded = jwt.verify(token, JWT_SECRET);
  return { valid: true, payload: decoded };
 } catch (error: any) {
  return { valid: false, payload: error.message };
 }
}
