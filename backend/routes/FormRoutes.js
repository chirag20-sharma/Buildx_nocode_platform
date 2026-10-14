import express from 'express';
import rateLimit from 'express-rate-limit';
import { submitForm, getSubmissions, deleteSubmission } from '../controllers/FormController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    validate: { trustProxy: false },
    message: { success: false, message: 'Too many submissions. Try again later.' }
});

// Public
router.post('/:projectId/submit', formLimiter, submitForm);

// Owner only
router.get('/:projectId/submissions', verifyToken, getSubmissions);
router.delete('/:projectId/submissions/:id', verifyToken, deleteSubmission);

export default router;
