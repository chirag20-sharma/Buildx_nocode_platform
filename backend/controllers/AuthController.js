import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { respond } from '../utils/respond.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const setAuthCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};

// User Registration
export const signup = async (req, res) => {
    try {
        const { name, password } = req.body;
        const email = typeof req.body.email === 'string' ? req.body.email.toLowerCase().trim() : '';

        if (!name || typeof name !== 'string' || name.trim().length < 2)
            return respond(res, "Name must be at least 2 characters", 400, false);
        if (!EMAIL_RE.test(email))
            return respond(res, "Please enter a valid email address", 400, false);
        if (!password || password.length < 8)
            return respond(res, "Password must be at least 8 characters", 400, false);

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return respond(res, "User already exists with this email", 400, false);

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
        const token = generateToken(newUser);

        // Set cookie
        setAuthCookie(res, token);

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
        const email = typeof req.body.email === 'string' ? req.body.email.toLowerCase().trim() : '';
        const { password } = req.body;

        if (!EMAIL_RE.test(email) || !password)
            return respond(res, "Email and password are required", 400, false);

        const user = await User.findOne({ email });
        if (!user)
            return respond(res, "Invalid email or password", 401, false);

        const isPasswordValid = await bcrypt.compare(password, user.password || '');
        if (!isPasswordValid)
            return respond(res, "Invalid email or password", 401, false);

        // Generate JWT token
        const token = generateToken(user);

        // Set cookie
        setAuthCookie(res, token);

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

export const googleAuthRedirect = (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

    if (!clientId || !callbackUrl) {
        return respond(res, "Google OAuth is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CALLBACK_URL in the backend environment.", 500, false);
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: callbackUrl,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent'
    });

    return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

export const googleAuthCallback = async (req, res) => {
    const { code, error } = req.query;

    if (error) {
        return respond(res, `Google OAuth failed: ${error}`, 400, false);
    }

    if (!code) {
        return respond(res, "Google OAuth callback is missing the authorization code.", 400, false);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!clientId || !clientSecret || !callbackUrl) {
        return respond(res, "Google OAuth is not configured yet. Add Google client credentials and callback URL to the backend environment.", 500, false);
    }

    try {
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: callbackUrl,
                grant_type: 'authorization_code'
            })
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.access_token) {
            console.error('Google token exchange failed:', tokenData);
            return respond(res, "Unable to exchange Google authorization code.", 400, false);
        }

        const userInfoResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        });

        const profile = await userInfoResponse.json();

        if (!userInfoResponse.ok || !profile.email) {
            console.error('Google userinfo lookup failed:', profile);
            return respond(res, "Unable to load Google profile information.", 400, false);
        }

        const email = profile.email.toLowerCase();
        const name = profile.name || `${profile.given_name || 'Google'} ${profile.family_name || 'User'}`.trim();

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name,
                email,
                password: null
            });
            await user.save();
        } else {
            user.name = user.name || name;
            await user.save();
        }

        const token = generateToken(user);
        setAuthCookie(res, token);

        const redirectUrl = new URL(frontendUrl);
        redirectUrl.searchParams.set('googleAuth', 'success');
        redirectUrl.searchParams.set('token', token);
        return res.redirect(redirectUrl.toString());
    } catch (error) {
        console.error('Google OAuth callback error:', error);
        return respond(res, "Error occurred during Google authentication", 500, false);
    }
};

// Get current user (/auth/me)
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return respond(res, "User not found", 404, false);
        return respond(res, "User fetched", 200, true, { user });
    } catch (error) {
        return respond(res, "Error fetching user", 500, false);
    }
};

// Forgot password
export const forgotPassword = async (req, res) => {
    try {
        const email = typeof req.body.email === 'string' ? req.body.email.toLowerCase().trim() : '';
        if (!EMAIL_RE.test(email)) return respond(res, "Valid email required", 400, false);

        const user = await User.findOne({ email });
        // Always respond 200 to avoid user enumeration
        if (!user) return respond(res, "If that email exists, a reset link has been sent", 200, true);

        const rawToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const resetLink = `${clientUrl}/reset-password?token=${rawToken}`;

        if (process.env.SMTP_HOST) {
            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.default.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            });
            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: email,
                subject: 'BuildX — Password Reset',
                text: `Reset your password: ${resetLink}\n\nExpires in 1 hour.`
            });
        } else {
            console.log(`[BuildX] Password reset link for ${email}: ${resetLink}`);
        }

        return respond(res, "If that email exists, a reset link has been sent", 200, true);
    } catch (error) {
        console.error('Forgot password error:', error);
        return respond(res, "Error processing request", 500, false);
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password || password.length < 8)
            return respond(res, "Token and password (min 8 chars) are required", 400, false);

        const hashed = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashed,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) return respond(res, "Invalid or expired reset token", 400, false);

        user.password = await bcrypt.hash(password, 12);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return respond(res, "Password reset successfully", 200, true);
    } catch (error) {
        console.error('Reset password error:', error);
        return respond(res, "Error resetting password", 500, false);
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