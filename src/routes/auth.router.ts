import { Router } from 'express';
import { signInValidators } from '../validators/signIn.validators.js';
import login from '../controllers/authApi/login.js';
import signUp from '../controllers/authApi/signUp.js';
import { loginValidators } from '../validators/login.validators.js';
const router = Router();

router.post('/signUp',signInValidators,signUp)
router.post('/login',loginValidators,login)

export default router;