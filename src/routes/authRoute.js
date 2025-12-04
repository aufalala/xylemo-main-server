import express from "express";
const router = express.Router();

import { verifyToken } from "../middleware/verifyToken.js";
import { requirePermLevel } from "../middleware/requirePermLevel.js";
import { userRefreshToken, userSignIn, userSignOut, userSignUp } from "../controllers/authCont.js";

router.get('/test-auth',
  verifyToken, requirePermLevel(1),
  async (req, res) => {
  res.sendStatus(200);
});

router.post('/signup',
  verifyToken, requirePermLevel(1),
  async (req, res) => {
  await userSignUp(req, res);
});

router.post("/signin", async (req, res) => {
  await userSignIn(req, res);
});

router.post("/refresh-token", async (req, res) => {
  await userRefreshToken(req, res);
});

router.post("/signout", async (req, res) => {
  await userSignOut(req, res);
});

export default router;