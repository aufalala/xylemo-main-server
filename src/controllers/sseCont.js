import { addClient, removeClient } from "../sse/sseManager.js";

export function sseEventsHandler(req, res) {
  // res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  const client = addClient(res);
  console.log("SSE client connected");

  res.write(`data: "connected"\n\n`);

  const heartbeat = setInterval(() => {
    res.write(`: keep-alive\n\n`);
  }, 25000);

  req.on("close", () => { // !! !! on front end, trigger close on logouts
    console.log("SSE client disconnected");
    clearInterval(heartbeat);
    removeClient(client);
  });
}
