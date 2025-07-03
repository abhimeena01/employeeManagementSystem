// routes/settingRoutes.js or similar
import express from 'express';
import { ChangePassword } from '../controllers/settingController.js';

const router = express.Router();

router.put('/change-password', ChangePassword); // <-- This route must match

export default router;
