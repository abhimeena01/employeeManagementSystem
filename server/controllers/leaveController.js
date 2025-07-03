import Employee from '../models/Employee.js';
import Leave from '../models/Leaves.js';

// ✅ Add Leave
const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    if (!userId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ success: false, error: 'Start date cannot be after end date.' });
    }

    const employee = await Employee.findOne({ userId }).lean();
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found for the given userId.' });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'Pending',
    });

    await newLeave.save();

    return res.status(201).json({ success: true, message: 'Leave added successfully.' });
  } catch (error) {
    console.error('Add Leave Error:', error.message);
    return res.status(500).json({ success: false, error: 'Server error while adding leave.' });
  }
};

// ✅ Get Leaves by User ID
const getLeavesByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({ userId: id }).lean();
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found for the given userId.' });
    }

    const leaves = await Leave.find({ employeeId: employee._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error('Get Leaves By User Error:', error.message);
    return res.status(500).json({ success: false, error: 'Server error while fetching leave data.' });
  }
};

// ✅ Get All Leaves (Admin)
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: 'employeeId',
        populate: [
          { path: 'department', select: 'dep_name' },
          { path: 'userId', select: 'name email' },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error('Get All Leaves Error:', error.message);
    return res.status(500).json({ success: false, error: 'Server error while fetching all leaves.' });
  }
};

// ✅ Get Leave Detail by ID
const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id).populate({
      path: 'employeeId',
      populate: [
        { path: 'department', select: 'dep_name' },
        { path: 'userId', select: 'name email profileImage' },
      ],
    });

    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave not found.' });
    }

    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error('Get Leave Detail Error:', error.message);
    return res.status(500).json({ success: false, error: 'Server error while fetching leave detail.' });
  }
};

// ✅ Update Leave Status by Leave ID
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required.' });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedLeave) {
      return res.status(404).json({ success: false, error: 'Leave not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Leave status updated successfully.',
      leave: updatedLeave,
    });
  } catch (error) {
    console.error('Update Leave Error:', error.message);
    return res.status(500).json({ success: false, error: 'Server error while updating leave.' });
  }
};

export {
  addLeave,
  getLeavesByUser,
  getAllLeaves,
  getLeaveDetail,
  updateLeaveStatus,
};
