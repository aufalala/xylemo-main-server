
import ChatModel from "../models/ChatModel.js";

import getTimestamp from "../utils/timestamp.js";

export async function checkChatOrderSvc(text) {
  if (!text || typeof text !== "string") {
    return { isOrder: false, productCode: null, quantity: null };
  }

  const trimmed = text.trim();

  const match = trimmed.match(/^([A-Z]+)\+(\d+)$/);

  if (!match) {
    console.log(`[${getTimestamp()}] Chat is not an order`);
    return { isOrder: false, productCode: null, quantity: null };
  }

  const productCode = match[1];
  const quantity = parseInt(match[2], 10);

  console.log(`[${getTimestamp()}] Chat is an order`);
  return { isOrder: true, productCode, quantity };
}