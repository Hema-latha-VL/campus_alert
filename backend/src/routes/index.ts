import { Router } from 'express';
import authRouter from './auth';
import eventsRouter from './events';
import feedbackRouter from './feedback';

const router = Router();

router.use('/auth', authRouter);
router.use('/events', eventsRouter);
router.use('/feedback', feedbackRouter);

export default router;
