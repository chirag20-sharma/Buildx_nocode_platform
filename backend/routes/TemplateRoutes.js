import express from 'express';
import { getAllTemplates, getTemplateById, useTemplate, createTemplate } from '../controllers/TemplateController.js';
import { verifyToken, requireAdmin } from '../middlewares/AuthMiddleware.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = express.Router();

router.get('/', getAllTemplates);
router.get('/:id', validateObjectId, getTemplateById);
router.post('/:id/use', validateObjectId, verifyToken, useTemplate);
router.post('/', verifyToken, requireAdmin, createTemplate);

export default router;
