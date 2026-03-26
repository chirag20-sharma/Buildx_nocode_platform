import express from "express";
import { generateDesign } from "../controllers/AIController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/generate", verifyToken, generateDesign);

export default router;
