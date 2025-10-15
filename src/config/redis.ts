import Redis from "ioredis";

export const redis = new Redis(
 process.env.REDIS_URL || "redis://127.0.0.1:6379"
);

(async () => {
 await redis.set("test", "ok");
 const val = await redis.get("test");
 console.log("Redis conectado ✅ Valor:", val);
})();
