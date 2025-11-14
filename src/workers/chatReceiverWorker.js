import { Worker } from "bullmq";
import { workerEventListeners } from "./_workerEventListener.js";

import getTimestamp from "../utils/timestamp.js";
import { processChatWorkflow } from "../workflows/chatWorkflow.js";

export function startChatReceiverWorker(redisConnection) {
  const chatReceiverWorker = new Worker(
    "chat-receiver-queue",
    async (job) => {
      console.log(`[${getTimestamp()}] Starting job, ${job.name}, [${job.id}]`);
      try {
        await processChatWorkflow({ chatData: job.data, caller: job.id });

      } catch (e) {
        console.error(`[${getTimestamp}] processChatWorkflow FAILED`, e);
      }
    },
    { connection: redisConnection }
  );
  
  workerEventListeners("chatReceiverWorker", chatReceiverWorker);
  console.log(`[${getTimestamp()}] ChatReceiverWorker started`);
}