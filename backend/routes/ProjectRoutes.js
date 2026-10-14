import express from 'express';
import {
    createProject, getUserProjects, getProjectById,
    updateProject, deleteProject, publishProject,
    unpublishProject, togglePublishProject, getPublicProjectById,
    exportProject, saveVersion, listVersions, restoreVersion
} from '../controllers/ProjectController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { validateObjectId } from '../middlewares/validateObjectId.js';

const router = express.Router();

router.get('/public/:id', validateObjectId, getPublicProjectById);

router.use(verifyToken);

router.get('/', getUserProjects);
router.post('/', createProject);
router.get('/:id', validateObjectId, getProjectById);
router.put('/:id', validateObjectId, updateProject);
router.delete('/:id', validateObjectId, deleteProject);
router.get('/:id/export', validateObjectId, exportProject);
router.get('/:id/versions', validateObjectId, listVersions);
router.post('/:id/versions', validateObjectId, saveVersion);
router.post('/:id/versions/:index/restore', validateObjectId, restoreVersion);
router.post('/:id/publish', validateObjectId, publishProject);
router.post('/:id/unpublish', validateObjectId, unpublishProject);
router.patch('/:id/publish', validateObjectId, togglePublishProject);

export default router;
