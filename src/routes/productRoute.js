import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { requirePermLevel } from "../middleware/requirePermLevel.js";

import { createProductCont, getProductsCont } from "../controllers/productCont.js";

const router = express.Router();

router.post('/', 
    // verifyToken, requirePermLevel(1), 
    async (req, res) => {
  await createProductCont({ req, res });
});

router.get('/active', 
    // verifyToken, requirePermLevel(2), 
    async (req, res) => {
  await getProductsCont({ req, res, filter: {status: "active"} });
});

router.get('/inactive', 
    // verifyToken, requirePermLevel(1), 
    async (req, res) => {
  await getProductsCont({ req, res, filter: {status: "inactive"} });
});

export default router;