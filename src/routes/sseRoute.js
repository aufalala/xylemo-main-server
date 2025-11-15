import express from "express";

import { sseEventsHandler } from "../controllers/sseCont.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requirePermLevel } from "../middleware/requirePermLevel.js";

const router = express.Router();

router.get("/events",
    // verifyToken, requirePermLevel(2),
    sseEventsHandler);

export default router;
