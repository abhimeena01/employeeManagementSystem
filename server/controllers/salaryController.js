import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

const addSalary = async (req, res) => {
  try {
    const {
      employeeId,
      basicSalary,
      allowances = 0,
      deductions = 0,
      payDate,
    } = req.body;

    // Validate required fields
    if (!employeeId || !basicSalary || !payDate) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    const totalSalary = Number(basicSalary) + Number(allowances) - Number(deductions);

    const newSalary = new Salary({
      employeeId,
      basicSalary,
      allowances,
      deductions,
      netSalary: totalSalary,
      payDate,
    });

    await newSalary.save();

    return res.status(201).json({
      success: true,
      message: "Salary added successfully.",
      salary: newSalary,
    });
  } catch (error) {
    console.error("Add Salary Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Salary add server error",
    });
  }
};

const getSalary = async (req, res) => {
  try {
    const { id } = req.params;
    let salaryRecords;

    // Try direct match with employeeId first
    salaryRecords = await Salary.find({ employeeId: id }).populate(
      "employeeId",
      "employeeId name"
    );

    // If no records, check if 'id' is a userId and resolve employee._id
    if (!salaryRecords.length) {
      const employee = await Employee.findOne({ userId: id });
      if (!employee) {
        return res.status(404).json({ success: false, error: "Employee not found." });
      }

      salaryRecords = await Salary.find({ employeeId: employee._id }).populate(
        "employeeId",
        "employeeId name"
      );
    }

    return res.status(200).json({ success: true, salary: salaryRecords });
  } catch (error) {
    console.error("Get Salary Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Salary get server error",
    });
  }
};

export { addSalary, getSalary };
