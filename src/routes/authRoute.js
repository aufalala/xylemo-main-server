import express from "express";
const router = express.Router();

import { verifyToken } from "../middleware/verifyToken.js";
import { requirePermLevel } from "../middleware/requirePermLevel.js";
import { userSignIn, userSignUp } from "../controllers/authCont.js";


router.post('/signup', verifyToken, requirePermLevel(1), async (req, res) => {
  await userSignUp(req, res);
});

router.post("/signin", async (req, res) => {
  await userSignIn(req, res);
});

export default router;