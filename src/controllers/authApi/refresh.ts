import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { AppError } from "../../errorHandling/errorClass.js";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.js";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new AppError('Refresh token required', HttpStatusCode.BadRequest);
        }

        // Verifica il refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret') as { userId: string };
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            throw new AppError('Invalid refresh token', HttpStatusCode.Unauthorized);
        }

        // Genera nuovo access token
        const newToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1h' });

        // Opzionalmente, genera un nuovo refresh token per rotazione
        const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret', { expiresIn: '7d' });
        user.refreshToken = newRefreshToken;
        await user.save();

        res.status(HttpStatusCode.Ok).json({ token: newToken, refreshToken: newRefreshToken,user: { email: user.email , id: user._id } });
    } catch (err) {
        next(err);
    }
};