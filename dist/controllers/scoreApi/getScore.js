import { Punteggio } from "../../models/punteggio.js";
import { HttpStatusCode } from "axios";
export default async (req, res, next) => {
    try {
        const id = req.params.userId;
        console.log('ID ricevuto:', id); // Debug: verifica l'ID ricevuto
        const punteggio = await Punteggio.findOne({ userId: id }); // recupera il documento con il nome e userId specificato
        if (!punteggio) {
            return res.status(HttpStatusCode.NotFound).json({ message: "Punteggio non trovato!" });
        }
        res.json(punteggio);
    }
    catch (err) {
        next();
    }
};
