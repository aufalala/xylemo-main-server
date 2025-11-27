import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { requirePermLevel } from "../middleware/requirePermLevel.js";

import { getOrdersCont } from "../controllers/orderCont.js";

const router = express.Router();

router.get('/', 
    verifyToken, requirePermLevel(2), 
    async (req, res) => {
  await getOrdersCont({ req, res });
});

export default router;