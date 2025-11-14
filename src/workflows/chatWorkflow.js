import ChatModel from "../models/ChatModel.js";
import { createNewBuyerSvc, getBuyerByNameAndPlatformSvc } from "../services/buyerSvc.js";
import { checkChatOrderSvc } from "../services/chatSvc.js";
import { createOrderSvc } from "../services/orderSvc.js";

import getTimestamp from "../utils/timestamp.js";

export async function processChatWorkflow({ chatData, caller = null }) {
  console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Starting chat workflow`);

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
    const checkedChat = await checkChatOrderSvc({ text: chatData.text, caller });
    if (!checkedChat.isOrder) {
      try {
        await chat.save(); // DB ACCESS CHATS
        console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Chat saved to MongoDB: ${chat._id}`);
        console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] End chat workflow`);

      } catch (e) {
        console.error(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Failed to save chat to MongoDB:`, e);
      }
      return;
    }

    // if checkedChat.isOrder, continue
    productCode = checkedChat.productCode;
    quantity = checkedChat.quantity;

  } catch (e) {
    console.error(`[${getTimestamp()}] [${caller}] [processChatWorkflow] checkChatOrder failed:`, e);
    try {
      await chat.save(); // DB ACCESS CHATS
      console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Chat saved to MongoDB: ${chat._id}`);
      console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] End chat workflow`);

    } catch (e) {
      console.error(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Failed to save chat to MongoDB:`, e);
    }
    return;
  }
  
  //////////////////////////////////////////////////////////////////////////////////////////

  // if checkedChat.isOrder, continue

  //////////////////////////////////////////////////////////////////////////////////////////
  try {
    const buyer = await getBuyerByNameAndPlatformSvc({ buyerName: chatData.username, platform: chatData.platform, caller });
    if (buyer) {
      buyerId = buyer._id;
    } else {
      const newBuyer = await createNewBuyerSvc({
        buyerName: chatData.username, 
        platformId: chatData.platformId, 
        platform: chatData.platform, 
        nickname: chatData.nickname, 
        createdAt: Date.now(), 
        caller,
      });
      buyerId = newBuyer._id;
    }

    const order = await createOrderSvc({ buyerId, productCode, quantity, caller });
    if (order.isFailedOrder) {
      console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Order creation FAILED`);
      chat.isFailedOrder = true;
    } else {
      chat.isOrder = true;
    }

  } catch (e) {
    console.error(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Order creation failed:`, e);
    chat.isFailedOrder = true;

  } finally {
    try {
      await chat.save(); // DB ACCESS CHATS
      console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Chat saved to MongoDB: ${chat._id}`);
      console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] End chat workflow`);
      
    } catch (e) {
      console.error(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Failed to save chat to MongoDB:`, e);
      return;
    }
  }
}
