import { HttpStatusCode } from "axios";
import { AppError } from "../../errorHandling/errorClass.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.js";
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
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret', { expiresIn: '7d' });
        // Salva il refresh token nel database
        user.refreshToken = refreshToken;
        await user.save();
        return res
            .cookie('token', token, {
            httpOnly: true, // Impedisce a JavaScript di leggere il token (Protezione XSS)
            secure: process.env.NODE_ENV === 'production', // Il cookie viene inviato solo su HTTPS (in produzione)
            sameSite: 'strict', // Protezione base contro attacchi CSRF
            maxAge: 1 * 60 * 60 * 1000, // Durata del cookie in millisecondi (es. 1 ora)
        })
            .cookie('refreshToken', refreshToken, {
            httpOnly: true, // Impedisce a JavaScript di leggere il token (Protezione XSS)
            secure: process.env.NODE_ENV === 'production', // Il cookie viene inviato solo su HTTPS (in produzione)
            sameSite: 'strict', // Protezione base contro attacchi CSRF
            maxAge: 1 * 24 * 60 * 60 * 1000, // 7 giorni  Durata del cookie in millisecondi (es. 1 ora)
            path: "/", // Disponibile per tutto il sito
        })
            .status(HttpStatusCode.Accepted)
            .json({ message: "Login successful", token, refreshToken, user: { email: user.email, id: user._id.toString() } });
    }
    catch (err) {
        next(err);
    }
};
