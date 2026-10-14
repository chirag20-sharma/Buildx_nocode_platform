import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import { connect } from './config/database.js';
import authRoutes from './routes/AuthRoutes.js';
import projectRoutes from './routes/ProjectRoutes.js';
import templateRoutes from './routes/TemplateRoutes.js';
import aiRoutes from './routes/AIRoutes.js';
import formRoutes from './routes/FormRoutes.js';
import analyticsRoutes from './routes/AnalyticsRoutes.js';
import dotenv from "dotenv";
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

// Fail fast if JWT_SECRET is missing
if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is not set. Exiting.');
    process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const deploymentsDir = path.resolve(__dirname, 'deployments');

// Ensure deployments directory exists
if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
}

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// Build allowed origins from CLIENT_URL env (comma-separated) + localhost defaults
const clientOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);
const devOrigins = ['http://localhost:5173','http://localhost:5174','http://localhost:3000','http://127.0.0.1:5173','http://127.0.0.1:5174','http://localhost:5000','http://127.0.0.1:5000'];
const allowedOrigins = [...new Set([...clientOrigins, ...devOrigins])];

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});

app.set('io', io);

// Authenticate socket connections with JWT
const projectRooms = new Map(); // projectId -> Set of socketIds

io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) return next(new Error('Authentication required'));
    try {
        socket.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        next(new Error('Invalid token'));
    }
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id, 'user:', socket.user?.userId);

    socket.on('join', (userId) => {
        socket.join(userId);
    });

    // Join a project editing room (owner only)
    socket.on('join-project', async ({ projectId }) => {
        try {
            const { default: Project } = await import('./models/Project.js');
            const project = await Project.findOne({ _id: projectId, userId: socket.user.userId }).select('_id');
            if (!project) { socket.emit('error', 'Not authorized'); return; }

            socket.join(`project:${projectId}`);
            if (!projectRooms.has(projectId)) projectRooms.set(projectId, new Set());
            projectRooms.get(projectId).add(socket.id);

            const count = projectRooms.get(projectId).size;
            io.to(`project:${projectId}`).emit('collaborators-count', { count });
        } catch (err) {
            socket.emit('error', 'Failed to join project room');
        }
    });

    // Broadcast component updates to other editors (last-write-wins)
    socket.on('components-update', ({ projectId, components }) => {
        socket.to(`project:${projectId}`).emit('components-update', { components, from: socket.id });
    });

    socket.on('disconnect', () => {
        projectRooms.forEach((sockets, projectId) => {
            if (sockets.has(socket.id)) {
                sockets.delete(socket.id);
                const count = sockets.size;
                io.to(`project:${projectId}`).emit('collaborators-count', { count });
                if (count === 0) projectRooms.delete(projectId);
            }
        });
        console.log('Client disconnected:', socket.id);
    });
});

// Database connection
connect();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Helmet with relaxed CSP for standalone deployed websites
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Not allowed by CORS"));
    },
    methods: "GET, POST, PUT, DELETE, HEAD, PATCH",
    credentials: true,
};
app.use(cors(corsOptions));
app.set('trust proxy', 1);

// Static hosting for deployed user websites
app.use('/sites', express.static(deploymentsDir, { extensions: ['html', 'htm'] }));

// Direct route /sites/:slug — only serve if project isPublished
app.get('/sites/:slug', async (req, res) => {
    const slug = req.params.slug;
    // Validate slug to prevent path traversal
    if (!/^[a-z0-9-]+$/.test(slug)) return res.status(400).send('Invalid slug');

    // Import Project model lazily to avoid circular dep issues at top level
    const { default: Project } = await import('./models/Project.js');
    const project = await Project.findOne({ slug }).select('isPublished').lean();
    if (!project || !project.isPublished) {
        return res.status(404).send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Not Found - BuildX</title><style>body{font-family:sans-serif;background:#0f0f13;color:#f1f5f9;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}.card{background:#18181f;padding:40px;border-radius:16px;border:1px solid #272732;max-width:440px}h1{font-size:22px;margin-bottom:12px}p{color:#94a3b8;font-size:15px;margin-bottom:24px}a{display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600}</style></head><body><div class="card"><h1>Website Not Found</h1><p>This website is either private, unpublished, or does not exist.</p><a href="${process.env.CLIENT_URL || 'http://localhost:5173'}">Go to BuildX</a></div></body></html>`);
    }
    const siteIndex = path.join(deploymentsDir, slug, 'index.html');
    if (fs.existsSync(siteIndex)) return res.sendFile(siteIndex);
    return res.status(404).send('Site files not found');
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/templates", templateRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/forms", formRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// Root route
app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "BuildX API & Deployment Server is running!",
        version: "1.0.0",
        endpoints: {
            auth: "/api/v1/auth",
            projects: "/api/v1/projects",
            templates: "/api/v1/templates",
            sites: "/sites/:slug"
        }
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Internal Server Error" 
    });
});

// Start server
server.listen(port, () => {
    console.log(`🚀 BuildX Server running on port ${port}`);
    console.log(`📱 API Base URL: http://localhost:${port}`);
    console.log(`🌐 Deployed Sites Base URL: http://localhost:${port}/sites/:slug`);
    console.log(`🔐 Auth endpoints: http://localhost:${port}/api/v1/auth`);
    console.log(`📁 Project endpoints: http://localhost:${port}/api/v1/projects`);
    console.log(`📋 Template endpoints: http://localhost:${port}/api/v1/templates`);
});