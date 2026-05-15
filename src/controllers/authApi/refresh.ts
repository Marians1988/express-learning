import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { AppError } from "../../errorHandling/errorClass.js";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "./cookieOptions.js";
import { redisService } from "../../service.ts/redis.service.js";
import { clearAuthCookies } from "../../utils/clearAuthCookies.js";

export default async (req: Request, res: Response, next: NextFunction) => {
    //const { refreshToken } = req.body; // Se usiamo body per il refresh token
    const refreshToken = req.cookies.refreshToken;
    const sessionId = req.sessionID;
    try {
        if (!refreshToken) {
            clearAuthCookies(res);
            throw new AppError('Refresh token required', HttpStatusCode.BadRequest);
        }
        if (!sessionId) {
            clearAuthCookies(res);
            throw new AppError('Session required', HttpStatusCode.Unauthorized);
        }

        // Verifica il refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret') as { userId: string };
        const user = await User.findById(decoded.userId);
        const validRefreshToken = await redisService.isValid(decoded.userId, refreshToken);
        const validSession = await redisService.isSessionValid(decoded.userId, sessionId);
        if (!user || !validRefreshToken || !validSession || req.session.userId !== decoded.userId) {
            clearAuthCookies(res);
            throw new AppError('Invalid refresh token', HttpStatusCode.Unauthorized);
        }

        // Genera nuovo access token
        const newToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1m' });

        // Opzionalmente, genera un nuovo refresh token per rotazione
        const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret', { expiresIn: '7d' });
        await redisService.saveRefreshToken(user._id.toString(), newRefreshToken);

        return res
            .cookie('token', newToken, accessTokenCookieOptions)
            .cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions)
            .status(HttpStatusCode.Ok)
            .json({ token: newToken, refreshToken: newRefreshToken, sessionId, user: { email: user.email , id: user._id } });
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
            clearAuthCookies(res);
        }
        next(err);
    }
};
