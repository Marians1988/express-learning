import { body, } from "express-validator";
export const validatorUser = [
    body('email').isEmail().withMessage('Inserisci un indirizzo email valido'),
    body('password').isLength({ min: 6 }).withMessage('Password troppo corta')
];
