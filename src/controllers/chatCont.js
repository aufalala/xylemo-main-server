
import ChatModel from "../models/ChatModel.js";

import getTimestamp from "../utils/timestamp.js";

export async function checkChatOrderCont(chatData) {
  const { timeUTC, username, platformId, text, platform, nickname = null } = chatData;
  let flagIsOrder = false;

  const chat = new ChatModel({
    timeUTC,
    username,
    platformId,
    text,
    platform,
    nickname,
    isOrder: false,
    isFailedOrder: false,
    isHighlighted: false,
  });

  //insert check order logic here

  //if order do (chat.isOrder = true) (flagIsOrder = true)
  
  try {
    await chat.save();
    console.log(`[${getTimestamp()}] Chat saved to MongoDB: ${chat._id}`);
  } catch (e) {
    console.error(`[${getTimestamp()}] Failed to save chat to MongoDB:`, e);
  }

  //if order do [create order] here (remember to decr order quantity if SOH, check stock >0)

  //insert SSE message for chat
  //if order do SSE message for order
}