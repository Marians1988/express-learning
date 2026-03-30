import { NextFunction, Request, Response } from "express";
import { Punteggio } from "../../models/punteggio.js";
import { HttpStatusCode } from "axios";

interface AuthRequest extends Request {
    userId?: string;
}

export default async (req : AuthRequest, res: Response,next:NextFunction) =>{
    try {
        const id = req.params.userId;
        console.log('ID ricevuto:', id); // Debug: verifica l'ID ricevuto
        const punteggio = await Punteggio.findOne({ userId: id }); // recupera il documento con il nome e userId specificato
        if (!punteggio) {
            return res.status(HttpStatusCode.NotFound).json({ message: "Punteggio non trovato!" });
        }
        res.json(punteggio);
    } catch (err) {
        next()
    }
}