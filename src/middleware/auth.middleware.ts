import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errorHandling/errorClass.js';
import { HttpStatusCode } from 'axios';

interface AuthRequest extends Request {
    userId?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        throw new AppError('Access token required', HttpStatusCode.Unauthorized);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string; email: string };
        req.userId = decoded.userId;
        next();
    } catch (err) {
        throw new AppError('Invalid token', HttpStatusCode.Unauthorized);
    }
};