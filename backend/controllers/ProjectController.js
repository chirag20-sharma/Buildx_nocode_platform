import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import { respond } from '../utils/respond.js';
import { generateHTML, generateCSS } from '../utils/codeGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const deploymentsBaseDir = path.resolve(__dirname, '..', 'deployments');

// Ensure deployments base folder exists
if (!fs.existsSync(deploymentsBaseDir)) {
    fs.mkdirSync(deploymentsBaseDir, { recursive: true });
}

// Convert string to URL-safe slug
export const normalizeComponent = (c) => {
    if (!c || typeof c !== 'object') return c;
    return {
        id: c.id,
        type: c.type,
        parentId: c.parentId || null,
        order: Number.isFinite(Number(c.order)) ? Number(c.order) : 0,
        properties: (c.properties && typeof c.properties === 'object') ? c.properties : ((c.props && typeof c.props === 'object') ? c.props : {}),
        styles: c.styles || {},
        position: c.position || { x: 0, y: 0 }
    };
};

export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Generate a collision-free slug
export const getUniqueSlugForProject = async (name, projectId, customSlug = null) => {
    // If an explicit custom slug is provided by user, use that base
    if (customSlug && typeof customSlug === 'string' && customSlug.trim()) {
        let base = slugify(customSlug) || 'site';
        let slugCandidate = base;
        let counter = 1;
        while (true) {
            const existing = await Project.findOne({ slug: slugCandidate, _id: { $ne: projectId } });
            if (!existing) {
                return slugCandidate;
            }
            counter += 1;
            slugCandidate = `${base}-${counter}`;
        }
    }

    // If project already has an assigned slug, retain it so re-publishing updates the existing site
    const current = await Project.findById(projectId);
    if (current && current.slug) {
        return current.slug;
    }

    let base = slugify(name) || 'site';
    let slugCandidate = base;
    let counter = 1;
    while (true) {
        const existing = await Project.findOne({ slug: slugCandidate, _id: { $ne: projectId } });
        if (!existing) {
            return slugCandidate;
        }
        counter += 1;
        slugCandidate = `${base}-${counter}`;
    }
};

// Create a new project
export const createProject = async (req, res) => {
    try {
        const { name, description, components = [], settings = {} } = req.body;
        const userId = req.user.userId; // From auth middleware
        
        // Validate required fields
        if (!name) {
            return respond(res, "Project name is required", 400, false);
        }

        const normalizedPages = Array.isArray(settings.pages)
            ? settings.pages.map((page) => ({
                id: page?.id || undefined,
                name: page?.name || "Page",
                components: Array.isArray(page?.components) ? page.components.map(normalizeComponent) : []
            }))
            : [];
        
        // Create new project
        const newProject = new Project({
            name,
            description,
            userId,
            components: Array.isArray(components) ? components.map(normalizeComponent) : [],
            settings: {
                theme: settings.theme || "light",
                layout: settings.layout || "responsive",
                pages: normalizedPages
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

        // Whitelist only safe client-editable fields
        const { name, description, components, settings } = req.body;
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (components !== undefined) updateData.components = Array.isArray(components) ? components.map(normalizeComponent) : [];

        if (settings && typeof settings === 'object') {
            const normalizedPages = Array.isArray(settings.pages)
                ? settings.pages.map((page) => ({
                    id: page?.id || undefined,
                    name: page?.name || "Page",
                    components: Array.isArray(page?.components) ? page.components.map(normalizeComponent) : []
                }))
                : [];

            updateData.settings = {
                theme: settings.theme || "light",
                layout: settings.layout || "responsive",
                pages: normalizedPages
            };
        }
        
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

        // Clean up deployment files if they exist
        if (deletedProject.slug) {
            const deploymentDir = path.join(deploymentsBaseDir, deletedProject.slug);
            if (fs.existsSync(deploymentDir)) {
                try {
                    await fs.promises.rm(deploymentDir, { recursive: true, force: true });
                } catch (rmErr) {
                    console.error("Error removing deployment files for deleted project:", rmErr);
                }
            }
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

// REAL Deployment & Publishing for a Project
export const publishProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { customSlug, components, name, settings } = req.body || {};
        const userId = req.user.userId;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return respond(res, "Invalid website ID.", 400, false);
        }

        // Verify project ownership
        const project = await Project.findOne({ _id: id, userId });
        if (!project) {
            return respond(res, "Project not found or you are not authorized to publish this website.", 404, false);
        }

        // Apply latest components/name if provided in request body
        if (components && Array.isArray(components)) {
            project.components = components.map(normalizeComponent);
        }
        if (name && typeof name === 'string' && name.trim().length >= 2) {
            project.name = name.trim();
        }
        if (settings) {
            project.settings = { ...project.settings, ...settings };
        }

        // Determine unique slug for deployment
        const slug = await getUniqueSlugForProject(project.name, project._id, customSlug);

        // Generate full standalone HTML and CSS
        const html = generateHTML(project);
        const css = generateCSS(project);

        // Create isolated deployment folder
        const deploymentDir = path.join(deploymentsBaseDir, slug);
        await fs.promises.mkdir(deploymentDir, { recursive: true });

        // Write deployable files
        await fs.promises.writeFile(path.join(deploymentDir, 'index.html'), html, 'utf-8');
        await fs.promises.writeFile(path.join(deploymentDir, 'style.css'), css, 'utf-8');

        // Construct live working URL
        const port = process.env.PORT || 5000;
        const host = process.env.HOST || `http://localhost:${port}`;
        const liveUrl = `${host}/sites/${slug}`;

        // Save project with active deployment status
        project.isPublished = true;
        project.slug = slug;
        project.publishedUrl = liveUrl;
        await project.save();

        return respond(res, "Website published successfully!", 200, true, {
            project,
            slug,
            publishedUrl: liveUrl
        });

    } catch (error) {
        console.error('Publish project error:', error);
        return respond(res, `Failed to deploy website: ${error.message}`, 500, false);
    }
};

// Unpublish / deactivate a deployed website
export const unpublishProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const project = await Project.findOne({ _id: id, userId });
        if (!project) {
            return respond(res, "Project not found or you are not authorized.", 404, false);
        }

        project.isPublished = false;
        await project.save();

        return respond(res, "Website unpublished successfully", 200, true, {
            project
        });

    } catch (error) {
        console.error('Unpublish project error:', error);
        return respond(res, "Error occurred while unpublishing website", 500, false);
    }
};

// Legacy togglePublishProject (adapted to use real deployment)
export const togglePublishProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        
        const project = await Project.findOne({ _id: id, userId });
        if (!project) {
            return respond(res, "Project not found", 404, false);
        }
        
        if (project.isPublished) {
            return unpublishProject(req, res);
        } else {
            return publishProject(req, res);
        }
        
    } catch (error) {
        console.log('Toggle publish error:', error);
        return respond(res, "Error occurred while updating project status", 500, false);
    }
};

// Get a single published project by ID (public access)
export const getPublicProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const project = await Project.findOne({ _id: id, isPublished: true })
            .select('name description components settings isPublished slug publishedUrl createdAt updatedAt');
        
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

// Save a named version snapshot
export const saveVersion = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const { label } = req.body;
        const project = await Project.findOne({ _id: id, userId });
        if (!project) return respond(res, "Project not found", 404, false);

        const snapshot = {
            components: project.components,
            settings: project.settings,
            savedAt: new Date(),
            label: label || `Version ${project.versions.length + 1}`
        };
        project.versions.push(snapshot);
        if (project.versions.length > 20) project.versions = project.versions.slice(-20);
        await project.save();
        return respond(res, "Version saved", 200, true, { version: snapshot });
    } catch (error) {
        return respond(res, "Error saving version", 500, false);
    }
};

// List versions
export const listVersions = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const project = await Project.findOne({ _id: id, userId }).select('versions');
        if (!project) return respond(res, "Project not found", 404, false);
        return respond(res, "Versions fetched", 200, true, { versions: project.versions });
    } catch (error) {
        return respond(res, "Error fetching versions", 500, false);
    }
};

// Restore a version by index
export const restoreVersion = async (req, res) => {
    try {
        const { id, index } = req.params;
        const userId = req.user.userId;
        const project = await Project.findOne({ _id: id, userId });
        if (!project) return respond(res, "Project not found", 404, false);
        const v = project.versions[Number(index)];
        if (!v) return respond(res, "Version not found", 404, false);
        project.components = v.components;
        project.settings = v.settings;
        await project.save();
        return respond(res, "Version restored", 200, true, { project });
    } catch (error) {
        return respond(res, "Error restoring version", 500, false);
    }
};

// Export project as ZIP (owner only)
export const exportProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const project = await Project.findOne({ _id: id, userId });
        if (!project) return respond(res, "Project not found", 404, false);

        const html = generateHTML(project);
        const css = generateCSS(project);
        const filename = `${project.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.zip`;

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.on('error', err => { throw err; });
        archive.pipe(res);
        archive.append(html, { name: 'index.html' });
        archive.append(css, { name: 'style.css' });
        await archive.finalize();
    } catch (error) {
        console.error('Export project error:', error);
        if (!res.headersSent)
            return respond(res, "Failed to export project", 500, false);
    }
};