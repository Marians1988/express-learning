import { Punteggio } from "../../models/punteggio.js";
export default async (req, res, next) => {
    try {
        const punteggi = await Punteggio.find(); // recupera tutti i documenti
        res.json(punteggi);
    }
    catch (err) {
        next();
    }
};
