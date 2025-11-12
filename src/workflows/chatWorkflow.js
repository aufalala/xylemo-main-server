import ChatModel from "../models/ChatModel.js";
import { createNewBuyer, getBuyerByNameAndPlatform } from "../services/buyerSvc.js";
import { checkChatOrderSvc } from "../services/chatSvc.js";
import { createOrderSvc } from "../services/orderSvc.js";

import getTimestamp from "../utils/timestamp.js";

export async function processChatWorkflow(chatData) {
  console.log(`[${getTimestamp()}] Starting chat workflow`);

  const chat = new ChatModel({
    timeUTC: chatData.timeUTC,
    username: chatData.username,
    platformId: chatData.platformId,
    text: chatData.text,
    platform: chatData.platform,
    nickname: chatData.nickname,
    isOrder: false,
    isFailedOrder: false,
    isHighlighted: false,
  });
  
  let buyerId;
  let productCode;
  let quantity;

  //////////////////////////////////////////////////////////////////////////////////////////
  try {
    const checkedChat = await checkChatOrderSvc(chatData.text);
    if (!checkedChat.isOrder) {
      try {
        await chat.save();
        console.log(`[${getTimestamp()}] Chat saved to MongoDB: ${chat._id}`);

      } catch (e) {
        console.error(`[${getTimestamp()}] Failed to save chat to MongoDB:`, e);
      }

      return;
    }

    // if checkedChat.isOrder, continue
    productCode = checkedChat.productCode;
    quantity = checkedChat.quantity;

  } catch (e) {
    console.error(`[${getTimestamp()}] checkChatOrder failed:`, e);
  }
  
  //////////////////////////////////////////////////////////////////////////////////////////

  // if checkedChat.isOrder, continue

  //////////////////////////////////////////////////////////////////////////////////////////
  try {
    const buyer = await getBuyerByNameAndPlatform(chatData.username, chatData.platform);
    if (buyer) {
      buyerId = buyer._id;
    } else {
      const newBuyer = await createNewBuyer({
        buyerName: chatData.username, 
        platformId: chatData.platformId, 
        platform: chatData.platform, 
        nickname: chatData.nickname, 
        createdAt: Date.now(), 
      });
      buyerId = newBuyer._id;
    }

  } catch (e) {
    console.error(`[${getTimestamp()}] getBuyerByNameAndPlatform failed:`, e);
  }


  //////////////////////////////////////////////////////////////////////////////////////////
  try {
    const order = await createOrderSvc({buyerId, productCode, quantity});
    if (order.isFailedOrder) {
      console.log(`[${getTimestamp()}] Order creation FAILED`);
      chatData.isFailedOrder = true;
    } else {
      console.log(`[${getTimestamp()}] Order created: ${order._id}`);
      chatData.isOrder = true;
  }

  } catch (e) {
      console.error(`[${getTimestamp()}] Order creation failed:`, e);
      return;
  }

  
  //////////////////////////////////////////////////////////////////////////////////////////
  try {
    await chat.save();
    console.log(`[${getTimestamp()}] Chat saved to MongoDB: ${chat._id}`);

  } catch (e) {
    console.error(`[${getTimestamp()}] Failed to save chat to MongoDB:`, e);
  }
}
