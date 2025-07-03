import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addDepartment,
  getDepartments,
  editDepartment,
  getDepartmentById   // ✅ include this!
  ,updateDepartment,
  deleteDepartment
} from '../controllers/departmentController.js';

const router = express.Router();

router.post('/add', authMiddleware, addDepartment);    // Add department
router.get('/', authMiddleware, getDepartments);       // Get all departments
router.get('/:id', authMiddleware, getDepartmentById); // ✅ Get department by ID
router.put('/:id', authMiddleware, editDepartment);    // Edit department
router.put('/:id', authMiddleware, updateDepartment);  
router.delete('/:id', authMiddleware,deleteDepartment);  
export default router;
