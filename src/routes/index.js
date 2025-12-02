import express from "express";

const router = express.Router();

import authRoute from "./authRoute.js";
import buyerRoute from "./buyerRoute.js";
import chatRoute from "./chatRoute.js";
import orderRoute from "./orderRoute.js";
import productRoute from "./productRoute.js";
import ingestRoute from "./ingestRoute.js";
import userRoute from "./userRoute.js";
import analyticsRoute from "./analyticsRoute.js";
import sseRoute from "./sseRoute.js";

router.use("/auth", authRoute);
router.use("/buyer", buyerRoute);
router.use("/chat", chatRoute);
router.use("/order", orderRoute);
router.use("/product", productRoute);
router.use("/ingest", ingestRoute);
router.use("/user", userRoute);
router.use("/analytics", analyticsRoute);
router.use("/sse", sseRoute);

export default router;