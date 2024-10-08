import { Router } from 'express';
import { usersRouter } from './user-routes.js';
import songsRouter from  './song-routes.js';
import songLyricsRouter from './songlyric-routes.js';
import authRouter from "./auth-routes.js"; 

const router = Router();

router.use('/users', usersRouter);
router.use('/songs', songsRouter);
router.use('/lyrics', songLyricsRouter);

export default router;
