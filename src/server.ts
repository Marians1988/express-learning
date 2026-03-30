import 'dotenv/config';
import express from 'express';
import { connectToDB } from './database/connection.js';
import punteggiRouter from './routes/punteggi.router.js';
import authRouter from './routes/auth.router.js';
import errorHandling from './errorHandling/error-handling.js';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN || 'http://localhost:4200',
  methods: process.env.ACCESS_CONTROL_ALLOW_METHODS || 'GET,POST,PUT,DELETE',
}));

connectToDB()
.then(() =>{
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running on port ${process.env.PORT || 3000}`);
    }); 
    console.log('Connected to database"');
})
.catch(err=> console.log('Error db connection',err));

app.use('/games', punteggiRouter);
app.use('/games', authRouter);
app.use(errorHandling);