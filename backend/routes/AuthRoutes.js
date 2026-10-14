import express from "express";
import { rateLimit } from 'express-rate-limit';
import { login, signup, logout, googleAuthRedirect, googleAuthCallback, getMe, forgotPassword, resetPassword } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { success: false, message: "Too many attempts. Please try again in 15 minutes." },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
});

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/google", googleAuthRedirect);
router.get("/google/callback", googleAuthCallback);

export default router;
