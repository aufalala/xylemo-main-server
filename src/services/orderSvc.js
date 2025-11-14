import ProductModel from "../models/ProductModel.js";
import OrderModel from "../models/OrderModel.js";

import getTimestamp from "../utils/timestamp.js";

export async function createOrderSvc({ buyerId, productCode, quantity, orderDate = Date.now(), caller = null}) {

  try {
    const product = await ProductModel.findOne({ // DB ACCESS PRODUCTS
      productCode,
      status: "active",
    }); 
    
    if (!product) {
      console.log(`[${getTimestamp()}] [${caller}] [createOrderSvc] Product ${productCode} not found or inactive`);
      return {isFailedOrder: true};
    } else {
      console.log(`[${getTimestamp()}] [${caller}] [createOrderSvc] Product ${productCode} found`);
    }
    
    if (product.stockType === "SOH" && product.stock < quantity) {
      console.log(`[${getTimestamp()}] [${caller}] [createOrderSvc] Product ${productCode} insufficient stock quantity`);
      return {isFailedOrder: true};
    }

    const order = await OrderModel.create({ // DB ACCESS ORDERS
      buyer: buyerId,
      product: product._id,
      quantity,
      orderDate: Date.now(),
    });
    console.log(`[${getTimestamp()}] [${caller}] [createOrderSvc] Order created: ${order._id}`);

    if (product.stockType === "SOH") { // DB ACCESS PRODUCTS
      await ProductModel.updateOne(
        { _id: product._id, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } }
      );
      console.log(`[${getTimestamp()}] [${caller}] [createOrderSvc] Product stock quantity reduced by: ${quantity}`);
    }

    return {_id: order._id, isFailedOrder: false};
    
  } catch (e) {
    console.error(`[${getTimestamp()}] [${caller}] [createOrderSvc] createOrderSvc FAILED:`, e); 
    throw e;   
  }
}