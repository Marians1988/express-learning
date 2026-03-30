import { body, } from "express-validator";
import { AppError } from "../errorHandling/errorClass.js";
import { HttpStatusCode } from "axios";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";

export const loginValidators = [
    body('email')
    .isEmail()
    .withMessage('Inserisci un indirizzo email valido')
    .bail(),
    body('password')
     .custom(async(password, {req} )=>{
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
             throw new AppError('username is not registred', HttpStatusCode.BadRequest);
        }
        const doMatch = await bcrypt.compare(password,user.password);
        if(!doMatch) {
            throw new AppError('passwword is not correct', HttpStatusCode.BadRequest);
        }
    }),
];