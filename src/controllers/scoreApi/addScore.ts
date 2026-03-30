import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";
import { Punteggio } from "../../models/punteggio.js";
import { validationResult } from "express-validator";
import { AppError } from "../../errorHandling/errorClass.js";

export default (req :Request, res :Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new AppError( errors.array().map(err => `${err.type}: ${err.msg}`).join(', '),
                            HttpStatusCode.BadRequest
                          );
    }
    creaNuovoPunteggio(req,res,next)
    .then(()=>{ 
        res.status(HttpStatusCode.Accepted).json({ message: "Punteggio aggiunto!"});
    })
    .catch(err=>  console.log('Errore di salvataggio!',err));
}

async function creaNuovoPunteggio(req: Request,res: Response,next: NextFunction){
    try {
        const name = req.body?.name;
        const hours = req.body?.hours;
        const minutes = req.body?.minutes;
        const seconds = req.body?.seconds;
        const date =req?.body?.date;
        const nuovoPunteggio = new Punteggio({
            name,hours,minutes,seconds,date
        });
        await nuovoPunteggio.save();
    }catch(error){
        next(); 
    } 
}


