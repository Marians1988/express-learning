import { NextFunction, Request, Response } from "express";
import { Punteggio } from "../../models/punteggio.js";

export default async (req : Request, res: Response,next:NextFunction) =>{
    try {
        const punteggi = await Punteggio.find(); // recupera tutti i documenti
        res.json(punteggi);
    } catch (err) {
        next()
    }
}