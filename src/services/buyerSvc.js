import BuyerModel from "../models/BuyerModel.js";

import getTimestamp from "../utils/timestamp.js";

export async function getBuyerByNameAndPlatform(buyerName, platform) {
  const buyer = await BuyerModel.findOne({
    buyerName,
    platform,
  });
  if (buyer) console.log(`[${getTimestamp()}] Buyer exists: ${buyer._id}`);
  return buyer;
}

export async function createNewBuyer({buyerName, platformId = null, platform, nickname = null, createdAt = Date.now()}) {
  const newBuyer = await BuyerModel.create({
    buyerName,
    platformId,
    platform,
    nickname,
    createdAt,
  });
  if (newBuyer) console.log(`[${getTimestamp()}] New buyer created: ${newBuyer._id}`);
  return newBuyer;
}