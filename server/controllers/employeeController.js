import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';
import Employee from '../models/Employee.js';
import User from '../models/User.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Add Employee
const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: req.file ? req.file.filename : '',
    });

    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });

    await newEmployee.save();

    res.status(200).json({ success: true, message: 'Employee created successfully.' });
  } catch (error) {
    console.error('Add Employee Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error in adding employee' });
  }
};

// Get All Employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('userId', '-password')
      .populate('department');
    res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error('Get Employees Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get One Employee
const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee;
    employee = await Employee.findById(req.params.id)
      .populate('userId', '-password')
      .populate('department');
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(200).json({ success: true, employee }); 
  } catch (error) {
    console.error('Get Employee Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Update Employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maritalStatus, designation, department, salary } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.name = name;
    await user.save();

    employee.maritalStatus = maritalStatus;
    employee.designation = designation;
    employee.department = department;
    employee.salary = salary;
    await employee.save();

    res.status(200).json({ success: true, message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Update Employee Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ✅ Fetch Employees by Department ID (FIXED)
const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;
  try {
    const employees = await Employee.find({ department: id }).populate('userId', '-password');
    res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error('Get Employees by Department Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error fetching employees by department' });
  }
};

export {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
};
