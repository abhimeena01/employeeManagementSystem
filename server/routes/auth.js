// routes/authRoutes.js
import express from 'express';
import { login, verify } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/login — logs in the user
router.post('/login', login);

// GET /api/auth/verify — verifies token & returns user
router.get('/verify', authMiddleware, verify);

export default router;
