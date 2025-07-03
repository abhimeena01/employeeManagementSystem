import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leaves.js";

const getSummary = async (req, res) => {
  try {
    // Total employees count
    const totalEmployees = await Employee.countDocuments();

    // Total departments count
    const totalDepartments = await Department.countDocuments();

    // Total salary sum
    const totalSalaries = await Employee.aggregate([
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$salary" }
        }
      }
    ]);

    // Get unique employee IDs who applied for leave
    const employeeAppliedForLeave = await Leave.distinct("employeeId");

    // Leave status counts
    const leaveStatus = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Build leave summary object
    const leaveSummary = {
      appliedFor: employeeAppliedForLeave.length,
      approved: leaveStatus.find(item => item._id === "Approved")?.count || 0,
      rejected: leaveStatus.find(item => item._id === "Rejected")?.count || 0,
      pending: leaveStatus.find(item => item._id === "Pending")?.count || 0,
    };

    return res.status(200).json({
      success: true,
      totalEmployees,
      totalDepartments,
      totalSalary: totalSalaries[0]?.totalSalary || 0,
      leaveSummary,
    });

  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while generating dashboard summary",
    });
  }
};

export { getSummary };
