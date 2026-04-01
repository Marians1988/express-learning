import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "axios";
import jwt from 'jsonwebtoken';
import { User } from "../../models/user.js";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
            const user = await User.findById(decoded.userId);
            if (user) {
                user.refreshToken = undefined;
                await user.save();
            }
        }
        res.status(HttpStatusCode.Ok).json({ message: "Logged out successfully. Please remove the token from client storage." });
    } catch (err) {
        next(err);
    }
};