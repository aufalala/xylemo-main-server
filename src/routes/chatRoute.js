import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { requirePermLevel } from "../middleware/requirePermLevel.js";
import { getChatByDateCont, getChatTodayCont } from "../controllers/chatCont.js";

const router = express.Router();

router.get('/today', 
    verifyToken, requirePermLevel(2), 
    async (req, res) => {
  await getChatTodayCont({ req, res });
});

router.get('/by-date', 
    verifyToken, requirePermLevel(2), 
    async (req, res) => {
  await getChatByDateCont({ req, res });
});

export default router;