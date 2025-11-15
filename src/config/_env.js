import dotenv from "dotenv";
dotenv.config();

export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const TIMEZONE = process.env.TIMEZONE;