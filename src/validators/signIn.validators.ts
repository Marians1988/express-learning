import { body, } from "express-validator";
import { AppError } from "../errorHandling/errorClass.js";
import { HttpStatusCode } from "axios";
import { User } from "../models/user.js";

export const signInValidators = [
    body('email')
    .isEmail()
    .withMessage('Inserisci un indirizzo email valido')
    .bail()
    .custom(async(email,)=>{
        const user = await User.findOne({ email });
        if (user) {
            throw new AppError('user already existing', HttpStatusCode.BadRequest);
        }
    }),
    body('password').isLength({ min: 6 }).withMessage('Password troppo corta'),
];