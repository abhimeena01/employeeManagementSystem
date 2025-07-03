import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addLeave,
  getLeavesByUser,
  getAllLeaves,
  getLeaveDetail,
  updateLeaveStatus,
} from '../controllers/leaveController.js';

const router = express.Router();

// ✅ Add a new leave (Authenticated)
router.post('/add', authMiddleware, addLeave);

// ✅ Get all leaves (Admin - Authenticated)
router.get('/', authMiddleware, getAllLeaves);

// ✅ Get detailed info for a specific leave by leaveId (Authenticated)
router.get('/detail/:id', authMiddleware, getLeaveDetail);

// ✅ Update a leave's status by leaveId (Authenticated)
// Correct route used by backend
router.put('/status/:id', authMiddleware, updateLeaveStatus);

// ✅ Get leaves for a specific user by userId (Authenticated)
router.get('/user/:id', authMiddleware, getLeavesByUser);

// ✅ 🔁 Support for frontend using outdated route (optional but fixes 404s)
router.put('/user/:id', authMiddleware, updateLeaveStatus);

export default router;
