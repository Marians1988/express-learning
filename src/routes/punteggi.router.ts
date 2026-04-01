import { Router } from 'express';
import { scoreValidators } from '../validators/score.validators.js';
import addScore from '../controllers/scoreApi/addScore.js';
import getScores from '../controllers/scoreApi/getScores.js';
import getScore from '../controllers/scoreApi/getScore.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
const router = Router();

router.get('/punteggi', authenticateToken, getScores);
router.get('/punteggio/:id', authenticateToken, getScore);
router.post('/punteggio', authenticateToken, scoreValidators, addScore);

export default router;