import jwt from 'jsonwebtoken';
import { respond } from '../utils/respond.js';

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    try {
        // Get token from cookie or Authorization header
        let token = req.cookies.token;
        
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]; // Bearer TOKEN
        }
        
        if (!token) {
            return respond(res, "Access denied. No token provided.", 401, false);
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded; // Add user info to request object
        
        next(); // Continue to next middleware/route handler
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return respond(res, "Token has expired. Please login again.", 401, false);
        } else if (error.name === 'JsonWebTokenError') {
            return respond(res, "Invalid token. Please login again.", 401, false);
        } else {
            return respond(res, "Token verification failed.", 401, false);
        }
    }
};

// Optional middleware to get user info if token exists (for optional auth)
export const optionalAuth = (req, res, next) => {
    try {
        let token = req.cookies.token;
        
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            req.user = decoded;
        }
        
        next(); // Continue regardless of token presence
        
    } catch (error) {
        // If token is invalid, just continue without user info
        next();
    }
};