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

export function broadcast(data, caller) {
  if (isToday(data.chat.timeUTC)) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    console.log(`[${getTimestamp()}] [${caller}] [broadcast] Broadcasted`);
    
    for (const client of clients) {
      client.res.write(payload);
    }
  } else {
    console.log(`[${getTimestamp()}] [${caller}] [broadcast] Not broadcasted`);
  }

}