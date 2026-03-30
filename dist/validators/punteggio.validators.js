import { body, } from "express-validator";
export const validatorPunteggio = [
    body('date').isDate({ format: 'YYYY-MM-DD' }).withMessage('La data deve essere valida e in formato YYYY-MM-DD'),
];
