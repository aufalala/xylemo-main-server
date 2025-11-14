import BuyerModel from "../models/BuyerModel.js";

import getTimestamp from "../utils/timestamp.js";

export async function getBuyerByNameAndPlatformSvc({ buyerName, platform, caller = null }) {
  try {
    const buyer = await BuyerModel.findOne({
      buyerName,
      platform,
    });
    if (buyer) console.log(`[${getTimestamp()}] [${caller}] [getBuyerByNameAndPlatform] Buyer ${buyerName} found: ${buyer._id}`);
    return buyer;
    
  } catch (e) {
    console.error(`[${getTimestamp()}] [${caller}] [getBuyerByNameAndPlatform] getBuyerByNameAndPlatform FAILED:`, e); 
    throw e;     
  }
}

export async function createNewBuyerSvc({ buyerName, platformId = null, platform, nickname = null, createdAt = Date.now(), caller = null }) {
  try {
    const newBuyer = await BuyerModel.create({
      buyerName,
      platformId,
      platform,
      nickname,
      createdAt,
    });
    if (newBuyer) console.log(`[${getTimestamp()}] [${caller}] [createNewBuyer] New buyer created: ${newBuyer._id}`);
    return newBuyer;
    
  } catch (e) {
    console.error(`[${getTimestamp()}] [${caller}] [createNewBuyer] createNewBuyer FAILED:`, e); 
    throw e;     
  }
}