import { Router } from 'express';
import { addPunteggio, getPunteggi } from '../controllers/adminPunteggio.controller.js';
import { validatorPunteggio } from '../validators/punteggio.validators.js';
const router = Router();
router.get('/punteggi', getPunteggi);
router.post('/punteggio', validatorPunteggio, addPunteggio);
export default router;
