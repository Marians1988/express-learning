import { HttpStatusCode } from "axios";
import { AppError } from "../../errorHandling/errorClass.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions, } from "./cookieOptions.js";
import { redisService } from "../../service.ts/redis.service.js";
export default async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new AppError(errors.array().map(err => `${err.type}: ${err.msg}`).join(', '), HttpStatusCode.BadRequest);
        }
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new AppError('User not found', HttpStatusCode.NotFound);
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret', { expiresIn: '7d' });
        await new Promise((resolve, reject) => {
            req.session.regenerate((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        const loggedInAt = new Date().toISOString();
        req.session.userId = user._id.toString();
        req.session.loggedInAt = loggedInAt;
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        const sessionId = req.sessionID;
        // Salva il refresh token nel database
        // user.refreshToken = refreshToken;
        // await user.save();
        await redisService.saveRefreshToken(user._id.toString(), refreshToken);
        await redisService.saveSession(user._id.toString(), sessionId, loggedInAt);
        return res
            .cookie('token', token, accessTokenCookieOptions)
            .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
            .status(HttpStatusCode.Accepted)
            .json({ message: "Login successful", token, refreshToken, sessionId, loggedInAt, user: { email: user.email, id: user._id.toString() } });
    }
    catch (err) {
        next(err);
    }
};
