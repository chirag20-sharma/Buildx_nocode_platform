import express from 'express';
import { 
    createProject, 
    getUserProjects, 
    getProjectById, 
    updateProject, 
    deleteProject, 
    togglePublishProject,
    getPublicProjectById
} from '../controllers/ProjectController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Public route - anyone can view published projects without authentication
router.get('/public/:id', getPublicProjectById); // GET /api/v1/projects/public/:id

// Protected project routes require authentication
router.use(verifyToken);

// Project Routes
router.get('/', getUserProjects);           // GET /api/v1/projects - Get all user projects
router.post('/', createProject);            // POST /api/v1/projects - Create new project
router.get('/:id', getProjectById);         // GET /api/v1/projects/:id - Get single project
router.put('/:id', updateProject);          // PUT /api/v1/projects/:id - Update project
router.delete('/:id', deleteProject);       // DELETE /api/v1/projects/:id - Delete project
router.patch('/:id/publish', togglePublishProject); // PATCH /api/v1/projects/:id/publish - Toggle publish status

export default router;