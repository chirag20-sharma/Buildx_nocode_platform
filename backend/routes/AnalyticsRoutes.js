import express from 'express';
import rateLimit from 'express-rate-limit';
import { recordHit, getStats } from '../controllers/AnalyticsController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = express.Router();

const hitLimiter = rateLimit({ windowMs: 60 * 1000, limit: 30, validate: { trustProxy: false } });

router.post('/:slug/hit', hitLimiter, recordHit);
router.get('/:projectId/stats', validateObjectId, verifyToken, getStats);

export default router;
