import Project from '../models/Project.js';
import { respond } from '../utils/respond.js';

// Create a new project
export const createProject = async (req, res) => {
    try {
        const { name, description, components = [], settings = {} } = req.body;
        const userId = req.user.userId; // From auth middleware
        
        // Validate required fields
        if (!name) {
            return respond(res, "Project name is required", 400, false);
        }
        
        // Create new project
        const newProject = new Project({
            name,
            description,
            userId,
            components,
            settings: {
                theme: settings.theme || "light",
                layout: settings.layout || "responsive"
            }
        });
        
        await newProject.save();
        
        return respond(res, "Project created successfully", 201, true, {
            project: newProject
        });
        
    } catch (error) {
        console.log('Create project error:', error);
        return respond(res, "Error occurred while creating project", 500, false);
    }
};

// Get all projects for the logged-in user
export const getUserProjects = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const projects = await Project.find({ userId })
            .populate('userId', 'name email')
            .sort({ updatedAt: -1 }); // Most recently updated first
        
        return respond(res, "Projects fetched successfully", 200, true, {
            projects,
            count: projects.length
        });
        
    } catch (error) {
        console.log('Get projects error:', error);
        return respond(res, "Error occurred while fetching projects", 500, false);
    }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        
        const project = await Project.findOne({ _id: id, userId })
            .populate('userId', 'name email');
        
        if (!project) {
            return respond(res, "Project not found", 404, false);
        }
        
        return respond(res, "Project fetched successfully", 200, true, {
            project
        });
        
    } catch (error) {
        console.log('Get project error:', error);
        return respond(res, "Error occurred while fetching project", 500, false);
    }
};

// Update a project
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const updateData = req.body;
        
        // Find and update project
        const updatedProject = await Project.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true, runValidators: true }
        ).populate('userId', 'name email');
        
        if (!updatedProject) {
            return respond(res, "Project not found", 404, false);
        }
        
        return respond(res, "Project updated successfully", 200, true, {
            project: updatedProject
        });
        
    } catch (error) {
        console.log('Update project error:', error);
        return respond(res, "Error occurred while updating project", 500, false);
    }
};

// Delete a project
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        
        const deletedProject = await Project.findOneAndDelete({ _id: id, userId });
        
        if (!deletedProject) {
            return respond(res, "Project not found", 404, false);
        }
        
        return respond(res, "Project deleted successfully", 200, true, {
            deletedProject: {
                id: deletedProject._id,
                name: deletedProject.name
            }
        });
        
    } catch (error) {
        console.log('Delete project error:', error);
        return respond(res, "Error occurred while deleting project", 500, false);
    }
};

// Publish/Unpublish a project
export const togglePublishProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        
        const project = await Project.findOne({ _id: id, userId });
        
        if (!project) {
            return respond(res, "Project not found", 404, false);
        }
        
        // Toggle publish status
        project.isPublished = !project.isPublished;
        
        // Generate or remove published URL
        if (project.isPublished) {
            project.publishedUrl = `/p/${project._id}`;
        } else {
            project.publishedUrl = null;
        }
        
        await project.save();
        
        const message = project.isPublished ? "Project published successfully" : "Project unpublished successfully";
        
        return respond(res, message, 200, true, {
            project
        });
        
    } catch (error) {
        console.log('Toggle publish error:', error);
        return respond(res, "Error occurred while updating project status", 500, false);
    }
};

// Get a single published project by ID (public access, no auth required)
export const getPublicProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const project = await Project.findOne({ _id: id, isPublished: true })
            .select('name description components settings isPublished publishedUrl createdAt updatedAt');
        
        if (!project) {
            return respond(res, "This website is either private, unpublished, or does not exist.", 404, false);
        }
        
        return respond(res, "Published website loaded successfully", 200, true, {
            project
        });
        
    } catch (error) {
        console.log('Get public project error:', error);
        return respond(res, "Error occurred while fetching website", 500, false);
    }
};