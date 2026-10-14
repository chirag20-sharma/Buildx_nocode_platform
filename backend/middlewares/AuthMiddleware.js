import jwt from 'jsonwebtoken';
import { respond } from '../utils/respond.js';

export const verifyToken = (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token && req.headers.authorization)
            token = req.headers.authorization.split(' ')[1];
        if (!token) return respond(res, "Access denied. No token provided.", 401, false);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') return respond(res, "Token has expired. Please login again.", 401, false);
        if (error.name === 'JsonWebTokenError') return respond(res, "Invalid token. Please login again.", 401, false);
        return respond(res, "Token verification failed.", 401, false);
    }
};

// Role-based guard — requires user.role === 'admin'
export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin')
        return respond(res, "Admin access required.", 403, false);
    next();
};

export const optionalAuth = (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token && req.headers.authorization)
            token = req.headers.authorization.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
        next();
    } catch {
        next();
    }
};
