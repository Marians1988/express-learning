import mongoose from "mongoose";

//Schema → Definisce la struttura dei dati 
const Schema = mongoose.Schema;

export const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Model → interfaccia per fare CRUD sul database
export const User = mongoose.model('User',userSchema);