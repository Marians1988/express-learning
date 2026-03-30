import { body, ValidationChain, } from "express-validator";

export const scoreValidators :ValidationChain[] = [
    body('date').isDate({format: 'YYYY-MM-DD'}).withMessage('La data deve essere valida e in formato YYYY-MM-DD'),
]
