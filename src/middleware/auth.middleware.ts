import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errorHandling/errorClass.js';
import { HttpStatusCode } from 'axios';
import { redisService } from '../service.ts/redis.service.js';
import { clearAuthCookies, clearAuthTokensCookie } from '../utils/clearAuthCookies.js';

interface AuthRequest extends Request {
    userId?: string;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // const authHeader = req.headers['authorization'];     *se avessimo usato header Authorization: Bearer TOKEN
    // const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    const token = req.cookies.token; // Se usiamo cookie per il token
    const sessionId = req.sessionID;
    const sessionUserId = req.session.userId;

    if (!token || !sessionId || !sessionUserId) {
        clearAuthCookies(res);
        throw new AppError('Access token required', HttpStatusCode.Unauthorized);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string; email: string };
        const validSession = await redisService.isSessionValid(decoded.userId, sessionId);
        if (!validSession || decoded.userId !== sessionUserId) {
            clearAuthCookies(res);
            throw new AppError('Session expired', HttpStatusCode.Unauthorized);
        }
        req.userId = decoded.userId;
        next();
    } catch (err) {
        clearAuthTokensCookie(res);
        if (err instanceof AppError) {
            throw err;
        }
        throw new AppError('Invalid token', HttpStatusCode.Unauthorized);
    }
};
