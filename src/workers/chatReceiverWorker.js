import { Worker } from "bullmq";
import { workerEventListeners } from "./_workerEventListener.js";

import getTimestamp from "../utils/timestamp.js";

export function startChatReceiverWorker(redisConnection) {
  const chatReceiverWorker = new Worker(
    "chat-receiver-queue",
    async (job) => {
      console.log(`[${getTimestamp()}] Starting job, ${job.name}, ${job.id}`);
      
      const { time, username, platformId, text, platform, nickname = null } = job.data;
      
      console.log({
            time,
            username,
            platformId,
            text,
            platform,
            nickname,
          });
    },
    { connection: redisConnection }
  );
  
  workerEventListeners("chatReceiverWorker", chatReceiverWorker);
  console.log(`[${getTimestamp()}] ChatReceiverWorker started`);
}