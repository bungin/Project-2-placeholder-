import { Router } from 'express';

import { login, signup } from '../../controllers/authcontroller.js';



const router = Router();

// POST /login - Login a user
router.post('/login', login);

router.post('/signup', signup);

export default router;
