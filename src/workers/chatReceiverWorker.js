import { Worker } from "bullmq";
import { workerEventListeners } from "./_workerEventListener.js";

import getTimestamp from "../utils/timestamp.js";

export function startChatReceiverWorker(redisConnection) {
  const chatReceiverWorker = new Worker(
    "chat-receiver-queue",
    async (job) => {
      console.log(`[${getTimestamp()}] Starting job, ${job.name}, ${job.id}`);
      const { time, username, text, platform } = job.data;
      console.log(time);
      console.log(username);
      console.log(text);
      console.log(platform);
    },
    { connection: redisConnection }
  );
  
  workerEventListeners("chatReceiverWorker", chatReceiverWorker);
  console.log(`[${getTimestamp()}] ChatReceiverWorker started`);
}