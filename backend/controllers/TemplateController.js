import Template from '../models/Template.js';
import Project from '../models/Project.js';
import { respond } from '../utils/respond.js';

// Get all templates
export const getAllTemplates = async (req, res) => {
    try {
        const { category } = req.query;
        
        const filter = { isActive: true };
        if (category) {
            filter.category = category;
        }
        
        const templates = await Template.find(filter).sort({ usageCount: -1 });
        
        return respond(res, "Templates fetched successfully", 200, true, {
            templates,
            count: templates.length
        });
    } catch (error) {
        console.log('Get templates error:', error);
        return respond(res, "Error fetching templates", 500, false);
    }
};

// Get single template by ID
export const getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const template = await Template.findById(id);
        
        if (!template) {
            return respond(res, "Template not found", 404, false);
        }
        
        return respond(res, "Template fetched successfully", 200, true, {
            template
        });
    } catch (error) {
        console.log('Get template error:', error);
        return respond(res, "Error fetching template", 500, false);
    }
};

// Use template to create a project
export const useTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { projectName } = req.body;
        const userId = req.user.userId;
        
        const template = await Template.findById(id);
        
        if (!template) {
            return respond(res, "Template not found", 404, false);
        }
        
        // Create new project from template
        const newProject = new Project({
            name: projectName || `${template.name} - Copy`,
            description: template.description,
            userId,
            components: template.components,
            settings: template.settings
        });
        
        await newProject.save();
        
        // Increment template usage count
        template.usageCount += 1;
        await template.save();
        
        return respond(res, "Project created from template successfully", 201, true, {
            project: newProject
        });
    } catch (error) {
        console.log('Use template error:', error);
        return respond(res, "Error creating project from template", 500, false);
    }
};

// Create template (Admin only - for now anyone can create)
export const createTemplate = async (req, res) => {
    try {
        const { name, description, category, thumbnail, components, settings } = req.body;
        
        const newTemplate = new Template({
            name,
            description,
            category,
            thumbnail,
            components,
            settings
        });
        
        await newTemplate.save();
        
        return respond(res, "Template created successfully", 201, true, {
            template: newTemplate
        });
    } catch (error) {
        console.log('Create template error:', error);
        return respond(res, "Error creating template", 500, false);
    }
};