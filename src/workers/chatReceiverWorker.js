import { Worker } from "bullmq";
import { workerEventListeners } from "./_workerEventListener.js";

import getTimestamp from "../utils/timestamp.js";
import { processChatWorkflow } from "../workflows/chatWorkflow.js";

export function startChatReceiverWorker(redisConnection) {
  const chatReceiverWorker = new Worker(
    "chat-receiver-queue",
    async (job) => {
      console.log(`[${getTimestamp()}] Starting job, ${job.name}, ${job.id}`);

      // const { timeUTC, username, platformId, text, platform, nickname = null } = job.data;
      
      // console.log({
      //       timeUTC,
      //       username,
      //       platformId,
      //       text,
      //       platform,
      //       nickname,
      //     });

      try {
        await processChatWorkflow(job.data)

      } catch (e) {
        console.error(`[${getTimestamp}] checkChatOrderCont FAILED`, e);
      }
    },
    { connection: redisConnection }
  );
  
  workerEventListeners("chatReceiverWorker", chatReceiverWorker);
  console.log(`[${getTimestamp()}] ChatReceiverWorker started`);
}