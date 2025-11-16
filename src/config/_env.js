import dotenv from "dotenv";
dotenv.config();

export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
export const MONGODB_URI = process.env.MONGODB_URI;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES;
export const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES;

export const TIMEZONE = process.env.TIMEZONE;