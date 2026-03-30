import { HttpStatusCode } from "axios";
import { Punteggio } from "../models/punteggio.js";
import { validationResult } from "express-validator";
export function addPunteggio(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('data error');
        return res.status(HttpStatusCode.BadRequest).json({ errors: errors.array() });
    }
    creaNuovoPunteggio(req, res)
        .then(() => {
        res.status(HttpStatusCode.Accepted).json({ message: "Punteggio aggiunto!" });
    })
        .catch(err => console.log('Errore di salvataggio!', err));
}
async function creaNuovoPunteggio(req, res) {
    try {
        const name = req.body?.name;
        const hours = req.body?.hours;
        const minutes = req.body?.minutes;
        const seconds = req.body?.seconds;
        const date = req?.body?.date;
        const nuovoPunteggio = new Punteggio({
            name, hours, minutes, seconds, date
        });
        await nuovoPunteggio.save();
    }
    catch (error) {
        res.status(400).json({ message: 'error' });
    }
}
export async function getPunteggi(req, res) {
    try {
        const punteggi = await Punteggio.find(); // recupera tutti i documenti
        res.json(punteggi);
    }
    catch (err) {
        res.status(500).json({ errore: 'Errore durante il recupero degli utenti' });
    }
}
