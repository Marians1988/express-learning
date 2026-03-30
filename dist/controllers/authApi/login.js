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
        return res
            .setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10; httpOnly')
            .status(HttpStatusCode.Accepted)
            .json({ message: "Login successful", token });
    }
    catch (err) {
        next(err);
    }
};
