import express from "express";
import { rateLimit } from 'express-rate-limit';
import { login, signup, logout } from "../controllers/AuthController.js";

const router = express.Router();

// Rate limiting for auth routes (disabled for development)
// const authLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 5,
//     message: {
//         success: false,
//         message: "Too many authentication attempts. Please try again later."
//     },
//     standardHeaders: 'draft-8',
//     legacyHeaders: false,
// });

// Auth Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;