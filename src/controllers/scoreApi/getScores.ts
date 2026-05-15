import { NextFunction, Request, Response } from "express";
import { Punteggio } from "../../models/punteggio.js";
import { HttpStatusCode } from "axios";

interface AuthRequest extends Request {
    userId?: string;
}

export default async (req : AuthRequest, res: Response,next:NextFunction) =>{
    try {
        const punteggi = await Punteggio.find(); // recupera tutti i documenti
        res.status(HttpStatusCode.Ok).json(punteggi);
    } catch (err) {
        next()
    }
}