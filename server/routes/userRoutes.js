import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const employee = await Employee.findOne({ userId: user._id });

    res.status(200).json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        gender: employee?.gender || "N/A",
        dob: employee?.dob || null,
        employeeId: employee?.employeeId || "N/A",
        maritalStatus: employee?.maritalStatus || "N/A",
      },
    });
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
