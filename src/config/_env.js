import dotenv from "dotenv";
dotenv.config();

export const REDIS_URL = process.env.REDIS_URL;
export const MONGODB_URI = process.env.MONGODB_URI;
