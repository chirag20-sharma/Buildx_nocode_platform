import express from 'express';
import cors from 'cors';
import http from 'http';
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
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE, HEAD, PATCH",
    credentials: true,
};
app.use(cors(corsOptions));
app.set('trust proxy', 1);

// Global rate limiter (disabled for development)
// const globalLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 100,
//     message: {
//         success: false,
//         message: "Too many requests. Please try again later."
//     },
//     standardHeaders: 'draft-8',
//     legacyHeaders: false,
// });
// app.use(globalLimiter);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/templates", templateRoutes);
app.use("/api/v1/ai", aiRoutes);

// Root route
app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "BuildX API Server is running!",
        version: "1.0.0",
        endpoints: {
            auth: "/api/v1/auth",
            projects: "/api/v1/projects",
            templates: "/api/v1/templates"
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
    console.log(`🔐 Auth endpoints: http://localhost:${port}/api/v1/auth`);
    console.log(`📁 Project endpoints: http://localhost:${port}/api/v1/projects`);
    console.log(`📋 Template endpoints: http://localhost:${port}/api/v1/templates`);
});