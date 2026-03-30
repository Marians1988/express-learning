import mongoose from "mongoose";

//Schema → Definisce la struttura dei dati 
const Schema = mongoose.Schema;

export const PunteggioSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    hours:{
        type: Number,
        required: true,
        max: 24,
        min: 0,
    },
    minutes:{
        type: Number,
        required: true,
        max: 60,
        min: 0,
    },
    seconds:{
        type: Number,
        required: true,
        max: 60,
        min: 0,
    },
    date: {
        type: Date,
    }
});

// Model → interfaccia per fare CRUD sul database
export const Punteggio = mongoose.model('Punteggio',PunteggioSchema);