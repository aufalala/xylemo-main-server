import express from "express";

const router = express.Router();

import authRoute from "./authRoute.js";
import buyerRoute from "./buyerRoute.js";
import chatRoute from "./chatRoute.js";
import orderRoute from "./orderRoute.js";
import productRoute from "./productRoute.js";
import ingestRoute from "./ingestRoute.js";
import userRoute from "./userRoute.js";

router.use("/auth", authRoute);
router.use("/buyer", buyerRoute);
router.use("/chat", chatRoute);
router.use("/order", orderRoute);
router.use("/product", productRoute);
router.use("/ingest", ingestRoute);
router.use("/user", userRoute);

export default router;