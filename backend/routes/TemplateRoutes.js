import express from 'express';
import { 
    getAllTemplates, 
    getTemplateById, 
    useTemplate,
    createTemplate 
} from '../controllers/TemplateController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Public routes - anyone can view templates
router.get('/', getAllTemplates);
router.get('/:id', getTemplateById);

// Protected routes - require authentication
router.post('/:id/use', verifyToken, useTemplate);
router.post('/', verifyToken, createTemplate);

export default router;