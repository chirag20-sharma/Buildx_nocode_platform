import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { respond } from '../utils/respond.js';

// User Registration
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return respond(res, "User already exists with this email", 400, false);
        }
        
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        
        await newUser.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );
        
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        return respond(res, "User registered successfully", 201, true, {
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            token
        });
        
    } catch (error) {
        console.log('Signup error:', error);
        return respond(res, "Error occurred during registration", 500, false);
    }
};

// User Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return respond(res, "Email and password are required", 400, false);
        }
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return respond(res, "Invalid email or password", 401, false);
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return respond(res, "Invalid email or password", 401, false);
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );
        
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        return respond(res, "Login successful", 200, true, {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
        
    } catch (error) {
        console.log('Login error:', error);
        return respond(res, "Error occurred during login", 500, false);
    }
};

// Logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return respond(res, "Logged out successfully", 200, true);
    } catch (error) {
        console.log('Logout error:', error);
        return respond(res, "Error occurred during logout", 500, false);
    }
};