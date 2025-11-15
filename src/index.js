import "./config/_env.js";

import express from "express";
import cors from "cors";

import routes from "./routes/index.js";

import { connectRedis, redisConnection } from "./config/redis.js";
import { workerStartAll } from "./workers/_workerStartAll.js";

import { getTimestamp } from "./utils/timestamp.js";
import { connectDB } from "./config/db.js";
import { createInitialAdmin } from "./controllers/authCont.js";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  //111/////////////////////////////// --- MIDDLEWARE
  app.use(cors());
  app.use(express.json());

  //111/////////////////////////////// --- ROUTES
  app.use("/api", routes);

  //111/////////////////////////////// --- MONGODB ATLAS CONNECT
  console.log("----------------------------------------------------");
  try {
    await connectDB();
    console.log(`[${getTimestamp()}] MongoDB connected successfully`);

  } catch (e) {
    console.error(`[${getTimestamp()}] MongoDB failed to connect:`, e);
  }

  //111/////////////////////////////// --- REDIS CONNECT
  console.log("----------------------------------------------------");
  try {
    await connectRedis();
    console.log(`[${getTimestamp()}] Redis connected successfully`);
    workerStartAll(redisConnection);

  } catch (e) {
    console.error(`[${getTimestamp()}] Redis failed to connect:`, e);
  }

  //111/////////////////////////////// --- INITIAL ADMIN CREATION
  console.log("----------------------------------------------------");
  try {
    await createInitialAdmin();
    console.log(`[${getTimestamp()}] Initial user checked successfully`);

  } catch (e) {
    console.error(`[${getTimestamp()}] Initial user check failed`, e);
  }

  //111/////////////////////////////// --- SERVER START LISTEN
  console.log("----------------------------------------------------");
  const server = app.listen(PORT, () => {
    console.log(`[${getTimestamp()}] Listening on port ${PORT}...`);
  });

  //111/////////////////////////////// --- ROOT
  app.get("/", (req, res) => res.send("Server is running!"));

}

startServer();