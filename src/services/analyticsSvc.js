import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

import { TIMEZONE } from "../config/_env.js";

import OrderModel from "../models/OrderModel.js";
import ChatModel from "../models/ChatModel.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function getAllDateAnalyticsSvc(req, res) {
  const orders = await OrderModel.find({});
  const chats = await ChatModel.find({});

  const result = {};

  function addItem(type, item, timestamp) {
    const d = dayjs(timestamp).tz(TIMEZONE);

    const monthKey = d.format("YYYY-MM");
    const dayKey = d.format("DD");

    if (!result[monthKey]) result[monthKey] = { days: {} };

    if (!result[monthKey].days[dayKey]) {
      result[monthKey].days[dayKey] = {
        orderCount: 0,
        buyerSet: new Set(),
        chatCount: 0,
      };
    }

    const ref = result[monthKey].days[dayKey];

    if (type === "order") {
      ref.orderCount++;
      if (item.buyer) ref.buyerSet.add(String(item.buyer));
    }

    if (type === "chat") {
      ref.chatCount++;
    }
  }

  orders.forEach(o => addItem("order", o, o.orderDate));
  chats.forEach(c => addItem("chat", c, c.timeUTC));

  for (const month of Object.values(result)) {
    for (const day of Object.values(month.days)) {
      day.buyerCount = day.buyerSet.size;
      delete day.buyerSet;
    }
  }

  return result;
}
