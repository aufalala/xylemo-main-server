import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/_env.js";

export function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded;
    
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token.' });
  }
}