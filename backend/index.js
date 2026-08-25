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
import dotenv from "dotenv";
import { Server } from 'socket.io';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

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

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: process.env.origin || "http://localhost:3000",
        credentials: true,
    },
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} has been connected to socket`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
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
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
];

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

// Direct route /sites/:slug fallback
app.get('/sites/:slug', (req, res) => {
    const slug = req.params.slug;
    const siteIndex = path.join(deploymentsDir, slug, 'index.html');
    if (fs.existsSync(siteIndex)) {
        return res.sendFile(siteIndex);
    }
    return res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Website Not Found - BuildX</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f13; color: #f1f5f9; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
            .card { background: #18181f; padding: 40px; border-radius: 16px; border: 1px solid #272732; max-width: 440px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            h1 { font-size: 22px; margin-bottom: 12px; color: #ffffff; }
            p { color: #94a3b8; font-size: 15px; margin-bottom: 24px; line-height: 1.5; }
            a { display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; transition: background 0.2s; }
            a:hover { background: #4f46e5; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>Website Not Found</h1>
            <p>The website "<strong>${slug}</strong>" is either private, unpublished, or has not been deployed yet.</p>
            <a href="http://localhost:5173">Go to BuildX Platform</a>
        </div>
    </body>
    </html>
    `);
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/templates", templateRoutes);
app.use("/api/v1/ai", aiRoutes);

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