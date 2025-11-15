import { getDayRange } from "../utils/timestamp.js";
import { getChatByDateSvc } from "../services/chatSvc.js";
import dayjs from "dayjs";
import { TIMEZONE } from "../config/_env.js";

export async function getChatTodayCont({ req, res }) {
  try {
    const { start, end } = getDayRange();

    const chats = await getChatByDateSvc({ start, end });
    return res.status(200).json(chats);

  } catch (e) {
    console.error("[getChatTodayCont] ERROR:", e);
    return res.status(500).json({ error: e.message });
  }
}

export async function getChatByDateCont({ req, res }) {
  try {
    const { day, month, year } = req.body;

    if (!day || !month || !year) {
      return res.status(400).json({
        error: "day, month, and year query params are required.",
      });
    }
    
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (isNaN(d) || isNaN(m) || isNaN(y)) {
      return res.status(400).json({
        error: "day, month, and year must be valid numbers.",
      });
    }

    const date = dayjs.tz(`${y}-${m}-${d}`, "YYYY-M-D", TIMEZONE);

    if (!date.isValid()) {
      return res.status(400).json({ error: "Invalid date provided." });
    }

    const { start, end } = getDayRange(date);

    const chats = await getChatByDateSvc({ start, end });
    return res.status(200).json(chats);

  } catch (e) {
    console.error("[getChatTodayCont] ERROR:", e);
    return res.status(500).json({ error: e.message });
  }
}