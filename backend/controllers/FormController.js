import mongoose from 'mongoose';
import Submission from '../models/Submission.js';
import Project from '../models/Project.js';
import { respond } from '../utils/respond.js';

// POST /api/v1/forms/:projectId/submit  (public, rate-limited in route)
export const submitForm = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(projectId))
            return respond(res, 'Invalid project ID', 400, false);

        const project = await Project.findOne({ _id: projectId, isPublished: true }).select('_id');
        if (!project) return respond(res, 'Form not found', 404, false);

        const { name = '', email = '', message = '', ...rest } = req.body || {};

        const sub = await Submission.create({
            projectId,
            name:    String(name).slice(0, 200),
            email:   String(email).slice(0, 200),
            message: String(message).slice(0, 2000),
            data:    rest
        });

        return respond(res, 'Message received!', 201, true, { id: sub._id });
    } catch (error) {
        console.error('Form submit error:', error);
        return respond(res, 'Error saving submission', 500, false);
    }
};

// GET /api/v1/forms/:projectId/submissions  (owner only)
export const getSubmissions = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(projectId))
            return respond(res, 'Invalid project ID', 400, false);

        const project = await Project.findOne({ _id: projectId, userId: req.user.userId }).select('_id');
        if (!project) return respond(res, 'Project not found', 404, false);

        const submissions = await Submission.find({ projectId }).sort({ createdAt: -1 }).limit(200);
        return respond(res, 'Submissions fetched', 200, true, { submissions });
    } catch (error) {
        return respond(res, 'Error fetching submissions', 500, false);
    }
};

// DELETE /api/v1/forms/:projectId/submissions/:id  (owner only)
export const deleteSubmission = async (req, res) => {
    try {
        const { projectId, id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(id))
            return respond(res, 'Invalid ID', 400, false);

        const project = await Project.findOne({ _id: projectId, userId: req.user.userId }).select('_id');
        if (!project) return respond(res, 'Project not found', 404, false);

        await Submission.findOneAndDelete({ _id: id, projectId });
        return respond(res, 'Submission deleted', 200, true);
    } catch (error) {
        return respond(res, 'Error deleting submission', 500, false);
    }
};
