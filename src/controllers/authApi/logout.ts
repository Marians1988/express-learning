import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "axios";
import jwt from 'jsonwebtoken';
import { redisService } from "../../service.ts/redis.service.js";
import { clearAuthCookies } from "../../utils/clearAuthCookies.js";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Se usiamo cookie per il token, altrimenti se usassimo header Authorization
        // const authHeader = req.headers['authorization'];
        // const token = authHeader && authHeader.split(' ')[1];
        const token = req.cookies.token;
        const sessionId = req.sessionID;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
            await redisService.revokeToken(decoded.userId);
            if (sessionId) {
                await redisService.revokeSessionId(decoded.userId, sessionId);
            }
        }

        req.session.destroy((err) => {
            if (err) {
                next(err);
                return;
            }

            clearAuthCookies(res);

            res
            .status(HttpStatusCode.Ok)
            .json({ message: "Logged out successfully. Please remove the token from cookies." });
        });
    } catch (err) {
        clearAuthCookies(res);
        next(err);
    }
};
