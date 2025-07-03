import mongoose from "mongoose";
import Employee from "./Employee.js";
import Leave from "./Leaves.js";
import Salary from "./Salary.js"; // ✅ Fix import path

const departmentSchema = new mongoose.Schema(
  {
    dep_name: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true, // ✅ Automatically handles createdAt and updatedAt
  }
);

// ✅ Delete related employees, leaves, and salaries when department is deleted
departmentSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    const employees = await Employee.find({ department: this._id });
    const empIds = employees.map(emp => emp._id);

    await Employee.deleteMany({ department: this._id });
    await Leave.deleteMany({ employeeId: { $in: empIds } });
    await Salary.deleteMany({ employeeId: { $in: empIds } });

    next();
  } catch (error) {
    next(error);
  }
});

const Department = mongoose.model("Department", departmentSchema);
export default Department;
