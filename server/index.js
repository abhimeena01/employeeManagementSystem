import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './db/db.js';
import salaryRouter from './routes/salary.js'
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';
import path from 'path'
import userRoutes from './routes/userRoutes.js';
import leaveRouter from './routes/leave.js'
import settingRouter from './routes/setting.js'
import dashboardRouter from './routes/dashboard.js'
dotenv.config();
connectToDatabase();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/uploads', express.static(path.join('public/uploads')));
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter); // ✅ Matches frontend: /api/department/:id
app.use('/api/employee', employeeRouter); 
app.use('/api/salary', salaryRouter); 
app.use('/api/user', userRoutes); 
app.use('/api/leave',leaveRouter); 
app.use('/api/setting',settingRouter); 
app.use('/api/dashboard',dashboardRouter); 
// Health check (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware (optional for better debugging)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Server error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
