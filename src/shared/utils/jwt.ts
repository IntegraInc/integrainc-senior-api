import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import { redis } from "../../config/redis";

const JWT_SECRET = process.env.JWT_SECRET!;
const CRED_KEY = process.env.CRED_KEY!;

// 🔸 Gera o token e salva usuario/senha criptografados no Redis
export async function createUserToken(username: string, password: string) {
 // Gera o token JWT
 const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });

 // Criptografa a senha antes de armazenar
 const encrypted = CryptoJS.AES.encrypt(password, CRED_KEY).toString();

 // Armazena no Redis por 24h
 await redis.set(`senior:${username}`, encrypted, "EX", 86400);

 return token;
}

export async function getSeniorCredentialsFromToken(token: string) {
 const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
 const encrypted = await redis.get(`senior:${decoded.username}`);
 if (!encrypted) throw new Error("Credenciais expiradas ou inválidas");

 const password = CryptoJS.AES.decrypt(encrypted, CRED_KEY).toString(
  CryptoJS.enc.Utf8
 );
 return { username: decoded.username, password };
}
export function verifyToken(token: string): { valid: boolean; payload?: any } {
 try {
  const decoded = jwt.verify(token, JWT_SECRET);
  return { valid: true, payload: decoded };
 } catch (error: any) {
  return { valid: false, payload: error.message };
 }
}
