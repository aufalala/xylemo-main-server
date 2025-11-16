import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/_env.js";

export function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token." });
  }
}