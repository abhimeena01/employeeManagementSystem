import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addSalary, getSalary } from '../controllers/salaryController.js';

const router = express.Router();

// Add a new salary record
router.post('/add', authMiddleware, addSalary);

// Get salary records by employee ID
router.get('/:id', authMiddleware, getSalary);

export default router;
