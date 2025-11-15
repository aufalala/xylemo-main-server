import IORedis from "ioredis";
import { REDIS_URL } from "./_env.js";

import { getTimestamp } from "../utils/timestamp.js";

export const redisConnection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
  tls: REDIS_URL.startsWith("rediss://") ? {} : undefined,
});

redisConnection.on("connect", () => console.log(`[${getTimestamp()}] Redis connecting...`));
redisConnection.on("ready", () => console.log(`[${getTimestamp()}] Redis ready!`));
redisConnection.on("error", (e) => console.error(`[${getTimestamp()}] Redis error:`, e.message));
redisConnection.on("close", () => console.log(`[${getTimestamp()}] Redis connection closed`));

export async function connectRedis() {
  if (redisConnection.status !== "ready") {
    try {
      await redisConnection.connect();
    } catch (e) {
      if (!e.message.includes("already connecting") && !e.message.includes(`[${getTimestamp()}] Redis already connected`)) {
        throw e;
      }
    }
  }

  return redisConnection;
}