
import BuyerModel from "../models/BuyerModel.js";
import ProductModel from "../models/ProductModel.js";
import OrderModel from "../models/OrderModel.js";

import getTimestamp from "../utils/timestamp.js";

export async function createOrderSvc({buyerId, productCode, quantity, orderDate = Date.now()}) {
  
  const product = await ProductModel.findOne({
    productCode,
    status: "active",
  });
  
  if (!product) {
    console.log(`Product ${productCode} not found or inactive`);
    return {isFailedOrder: true};
  }
  
  if (product.stockType === "SOH" && product.stock < quantity) {
    return {isFailedOrder: true};
  }

  const order = await OrderModel.create({
    buyer: buyerId,
    product: product._id,
    quantity,
    orderDate: Date.now(),
  });

  if (product.stockType === "SOH") {
    await ProductModel.updateOne(
      { _id: product._id, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } }
    );
  }

  return {_id: order._id, isFailedOrder: false};
}