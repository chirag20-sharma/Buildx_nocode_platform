import Visit from '../models/Visit.js';
import Project from '../models/Project.js';
import { respond } from '../utils/respond.js';

// POST /api/v1/analytics/:slug/hit  (public, no personal data)
export const recordHit = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!/^[a-z0-9-]+$/.test(slug)) return res.status(400).end();

        const day = new Date().toISOString().slice(0, 10);
        const path = String(req.body?.path || '/').slice(0, 200);
        const rawRef = req.headers.referer || req.body?.referrer || '';
        let referrer = '';
        try { referrer = new URL(rawRef).hostname; } catch {}

        await Visit.create({ slug, day, path, referrer });
        return res.status(204).end();
    } catch {
        return res.status(204).end(); // silent fail — never break the published site
    }
};

// GET /api/v1/analytics/:projectId/stats?days=7  (owner only)
export const getStats = async (req, res) => {
    try {
        const { projectId } = req.params;
        const days = Math.min(30, Math.max(1, Number(req.query.days) || 7));

        const project = await Project.findOne({ _id: projectId, userId: req.user.userId }).select('slug');
        if (!project || !project.slug) return respond(res, 'Project not found', 404, false);

        const since = new Date();
        since.setDate(since.getDate() - days);
        const sinceDay = since.toISOString().slice(0, 10);

        const visits = await Visit.aggregate([
            { $match: { slug: project.slug, day: { $gte: sinceDay } } },
            { $group: { _id: '$day', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const total = visits.reduce((s, v) => s + v.count, 0);
        return respond(res, 'Stats fetched', 200, true, { visits, total, slug: project.slug });
    } catch (error) {
        return respond(res, 'Error fetching stats', 500, false);
    }
};
