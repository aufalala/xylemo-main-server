import mongoose from "mongoose";
import { MONGODB_URI } from "./_env.js";

import getTimestamp from "../utils/timestamp.js";

mongoose.connection.on("connected", () => console.log(`[${getTimestamp()}] Connected to MongoDB: ${mongoose.connection.name}`));
mongoose.connection.on("error", (err) => console.error(`[${getTimestamp()}] MongoDB error:`, err));
mongoose.connection.on("disconnected", () => console.warn(`[${getTimestamp()}] MongoDB disconnected`));

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (err) {
    console.error(`[${getTimestamp()}] MongoDB connection error:`, err);
  }
}