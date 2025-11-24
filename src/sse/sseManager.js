import { getTimestamp, isToday } from "../utils/timestamp.js";

const clients = new Set();

export function addClient(res) {
  const client = { id: Date.now(), res };
  clients.add(client);
  return client;
}

export function removeClient(client) {
  clients.delete(client);
}

export function broadcastCheckToday(data, caller) {
  if (!isToday(data.chat.timeUTC)) {
    console.log(`[${getTimestamp()}] [${caller}] [broadcast] Not broadcasted`);
    return;
  }

  const payload = `data: ${JSON.stringify(data)}\n\n`;
  console.log(`[${getTimestamp()}] [${caller}] [broadcast] Broadcasted`);

  for (const client of clients) {
    try {
      client.res.write(payload);
    } catch (err) {
      console.error(`[${getTimestamp()}] [${caller}] Failed to send to client ${client.id}:`, err);
      clients.delete(client);
    }
  }
}

export function broadcastEvent(data, caller) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  console.log(`[${getTimestamp()}] [${caller}] [broadcast] Broadcasted`);

  for (const client of clients) {
    try {
      client.res.write(payload);
    } catch (err) {
      console.error(`[${getTimestamp()}] [${caller}] Failed to send to client ${client.id}:`, err);
      clients.delete(client);
    }
  }
}