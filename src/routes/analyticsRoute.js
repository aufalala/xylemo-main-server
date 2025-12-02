import express from "express";

import { getAllDateAnalyticsCont } from "../controllers/analyticsCont.js";

const router = express.Router();

router.get('/date', 
  // verifyToken, requirePermLevel(2), 
  async (req, res) => {
  await getAllDateAnalyticsCont({ req, res });
});

export default router;