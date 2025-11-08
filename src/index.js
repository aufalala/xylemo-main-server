import "./config/_env.js";

import express from "express";
import cors from "cors";

import { connectRedis, redisConnection } from "./config/redis.js";
import { workerStartAll } from "./workers/_workerStartAll.js";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3001;

  //111/////////////////////////////// --- MIDDLEWARE
  app.use(cors());
  app.use(express.json());

  //111/////////////////////////////// --- ROUTES


  //111/////////////////////////////// --- REDIS CONNECT
  try {
    await connectRedis();
    console.log(`Redis connected successfully`);
    workerStartAll(redisConnection);

  } catch (e) {
    console.error(`Redis failed to connect:`, e);
  }

  //111/////////////////////////////// --- SERVER START
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });

  //111/////////////////////////////// --- ROOT
  app.get("/", (req, res) => res.send("Server is running!"));

}

startServer();