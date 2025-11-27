import { getOrdersSvc } from "../services/orderSvc.js";

import { getTimestamp } from "../utils/timestamp.js";

export async function getOrdersCont({ req, res, filter = null }) {
  try {
    const orders = await getOrdersSvc({filter});
    return res.status(200).json(orders);
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}