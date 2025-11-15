import ChatModel from "../models/ChatModel.js";
import { createNewBuyerSvc, getBuyerByNameAndPlatformSvc } from "../services/buyerSvc.js";
import { checkChatOrderSvc } from "../services/chatSvc.js";
import { createOrderSvc } from "../services/orderSvc.js";
import { deductProductStockSvc, getProductForOrderSvc } from "../services/productSvc.js";
import { broadcast } from "../sse/sseManager.js";

import { getTimestamp } from "../utils/timestamp.js";

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

  //////////////////////////////////////////////////////////////////////////////////////////
  let checkedChat;
  try {
    checkedChat = await checkChatOrderSvc({ text: chatData.text, caller });
    if (!checkedChat.isOrder) {
      try {
        const savedChat = await chat.save(); // DB ACCESS CHATS
        console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Chat saved to MongoDB: ${chat._id}`);
      
        broadcast({
          type: "new_chat",
          chat: savedChat,
        }, caller);

        console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] End chat workflow`);

      } catch (e) {
        console.error(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Failed to save chat to MongoDB:`, e);
      }
      return;
    }

  } catch (e) {
    console.error(`[${getTimestamp()}] [${caller}] [processChatWorkflow] checkChatOrder failed:`, e);
    try {
      const savedChat = await chat.save(); // DB ACCESS CHATS
      console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Chat saved to MongoDB: ${chat._id}`);

      broadcast({
        type: "new_chat",
        chat: savedChat,
      }, caller);
      
      console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] End chat workflow`);

    } catch (e) {
      console.error(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Failed to save chat to MongoDB:`, e);
    }
    return;
  }
  
  //////////////////////////////////////////////////////////////////////////////////////////

  // if checkedChat.isOrder, continue
  let buyerName = chatData.username;
  let platform = chatData.platform;
  let productCode = checkedChat.productCode;
  let quantity = checkedChat.quantity;
  let buyerId;
  let productId;
  let orderDate = chatData.timeUTC;

  //////////////////////////////////////////////////////////////////////////////////////////
  try {
    const buyer = await getBuyerByNameAndPlatformSvc({ buyerName, platform, caller });
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

    //////////////////////////////////////////////////////////////////////////////////////////
    const product = await getProductForOrderSvc({ productCode, quantity, caller });
    if (product.stockType === "SOH") {
      const updatedProduct = await deductProductStockSvc({ product, quantity, caller });
      productId = product._id;
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////
    const order = await createOrderSvc({ buyerId, productId, orderDate, quantity, caller });
    if (order) {
      chat.isOrder = true;
    }

  } catch (e) {
    console.error(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Order creation failed:`, e);
    chat.isFailedOrder = true;

  } finally {
    try {
      const savedChat = await chat.save(); // DB ACCESS CHATS
      console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Chat saved to MongoDB: ${chat._id}`);

      broadcast({
        type: "new_chat",
        chat: savedChat,
      }, caller);

      console.log(`[${getTimestamp()}] [${caller}] [processChatWorkflow] End chat workflow`);
      
    } catch (e) {
      console.error(`[${getTimestamp()}] [${caller}] [processChatWorkflow] Failed to save chat to MongoDB:`, e);
      return;
    }
  } 
}
