import { startChatReceiverWorker } from "./chatReceiverWorker.js";

export function workerStartAll(redisConnection) {
  startChatReceiverWorker(redisConnection);
}