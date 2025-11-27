import ProductModel from "../models/ProductModel.js";
import OrderModel from "../models/OrderModel.js";

import { getTimestamp } from "../utils/timestamp.js";
import { broadcastEvent } from "../sse/sseManager.js";


export async function getOrdersSvc({filter = null}) {
  try {
    const orders = await OrderModel.find(filter).populate([
      { path: "buyer" },
      { path: "product" },
    ]);
    return orders;

  } catch (e) {
    console.error(`[${getTimestamp()}] getOrdersSvc FAILED:`, e);
    throw e; 
  }
}

export async function createOrderSvc({ buyerId, productId, quantity, orderDate = Date.now(), caller = null}) {
  try {
    let order = await OrderModel.create({ // DB ACCESS ORDERS
      buyer: buyerId,
      product: productId,
      quantity,
      orderDate,
    });

    order = await order.populate([
      { path: "buyer" },
      { path: "product" }
    ]);

    console.log(`[${getTimestamp()}] [${caller}] [createOrderSvc] Order created: ${order._id}`);

    broadcastEvent({
      type: "new_order",
      order: order,
    }, "createOrderSvc");

    return order;
    
  } catch (e) {
    console.error(`[${getTimestamp()}] [${caller}] [createOrderSvc] createOrderSvc FAILED:`, e); 
    throw e;   
  }
}