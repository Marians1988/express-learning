import { Punteggio } from "../../models/punteggio.js";
import { HttpStatusCode } from "axios";
export default async (req, res, next) => {
    try {
        const punteggi = await Punteggio.find(); // recupera tutti i documenti
        res.status(HttpStatusCode.Ok).json(punteggi);
    }
    catch (err) {
        next();
    }
};
