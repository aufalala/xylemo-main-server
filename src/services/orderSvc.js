import ProductModel from "../models/ProductModel.js";
import OrderModel from "../models/OrderModel.js";

import getTimestamp from "../utils/timestamp.js";

export async function createOrderSvc({ buyerId, productId, quantity, orderDate = Date.now(), caller = null}) {

  try {
    const order = await OrderModel.create({ // DB ACCESS ORDERS
      buyer: buyerId,
      product: productId,
      quantity,
      orderDate,
    });
    console.log(`[${getTimestamp()}] [${caller}] [createOrderSvc] Order created: ${order._id}`);

    return order;
    
  } catch (e) {
    console.error(`[${getTimestamp()}] [${caller}] [createOrderSvc] createOrderSvc FAILED:`, e); 
    throw e;   
  }
}