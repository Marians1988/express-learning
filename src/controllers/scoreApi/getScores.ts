import { NextFunction, Request, Response } from "express";
import { Punteggio } from "../../models/punteggio.js";

interface AuthRequest extends Request {
    userId?: string;
}

export default async (req : AuthRequest, res: Response,next:NextFunction) =>{
    try {
        const punteggi = await Punteggio.find(); // recupera tutti i documenti
        res.json(punteggi);
    } catch (err) {
        next()
    }
}