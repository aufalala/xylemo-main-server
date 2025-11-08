import { Queue }from "bullmq";
import { redisConnection } from "../config/redis.js";

export const queues = {
  chatReceiverQueue: new Queue("chat-receiver-queue", { connection: redisConnection }),
};