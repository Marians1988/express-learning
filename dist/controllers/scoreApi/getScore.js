import { Punteggio } from "../../models/punteggio.js";
import { HttpStatusCode } from "axios";
export default async (req, res, next) => {
    try {
        const name = req.params.name;
        console.log('Nome ricevuto:', name); // Debug: verifica il nome ricevuto
        const punteggio = await Punteggio.find({ name: name }); // recupera il documento con il nome specificato
        if (!punteggio) {
            return res.status(HttpStatusCode.NotFound).json({ message: "Punteggio non trovato!" });
        }
        res.json(punteggio);
    }
    catch (err) {
        next();
    }
};
