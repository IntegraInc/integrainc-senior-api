import { redis } from "../../config/redis";

/**
 * Armazena um valor no cache Redis.
 * @param key Chave de identificação (ex: "products:123")
 * @param data Qualquer dado serializável
 * @param ttl Tempo de expiração em segundos (opcional)
 */
export async function setCache<T>(
 key: string,
 data: T,
 ttl?: number
): Promise<void> {
 const value = JSON.stringify(data);
 if (ttl && ttl > 0) {
  await redis.set(key, value, "EX", ttl);
 } else {
  await redis.set(key, value);
 }
}

/**
 * Busca e desserializa o valor armazenado no cache.
 * @param key Chave usada no setCache
 * @returns O dado tipado ou null se não existir
 */
export async function getCache<T>(key: string): Promise<T | null> {
 const cached = await redis.get(key);
 if (!cached) return null;
 try {
  return JSON.parse(cached) as T;
 } catch {
  return null;
 }
}

/**
 * Remove uma chave do cache.
 */
export async function delCache(key: string): Promise<void> {
 await redis.del(key);
}

/**
 * Limpa todas as chaves com um prefixo específico (opcional)
 */
export async function clearCache(prefix: string): Promise<void> {
 const keys = await redis.keys(`${prefix}*`);
 if (keys.length) await redis.del(keys);
}
