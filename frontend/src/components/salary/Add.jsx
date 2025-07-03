import React, { useEffect, useState } from "react";
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [departments, setDepartments] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [salaryData, setSalaryData] = useState({
    employeeId: "",
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: "",
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const depResult = await fetchDepartments();
        setDepartments(depResult || []);
      } catch (error) {
        console.error("Error loading departments:", error);
        alert("Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleDepartmentChange = async (e) => {
    const depId = e.target.value;
    setSelectedDepartment(depId);
    setSalaryData((prev) => ({ ...prev, department: depId }));

    try {
      const employees = await getEmployees(depId); // ✅ ensure depId is _id
      setEmployeeList(employees || []);
    } catch (err) {
      console.error("Failed to fetch employees for department:", err);
      setEmployeeList([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalaryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5000/api/salary/add`,
        salaryData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Salary added successfully");
        navigate("/admin-dashboard/employees");
      } else {
        alert(response.data.error || "Failed to add salary.");
      }
    } catch (error) {
      console.error("Add salary error:", error);
      alert(
        error.response?.data?.error ||
          "Something went wrong while adding the salary."
      );
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Salary</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              onChange={handleDepartmentChange}
              value={selectedDepartment}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Dropdown */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Employee
            </label>
            <select
              name="employeeId"
              value={salaryData.employeeId}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Employee</option>
              {employeeList.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.employeeId || emp.userId?.name || "Unnamed"}
                </option>
              ))}
            </select>
          </div>

          {/* Basic Salary */}
          <InputField
            name="basicSalary"
            label="Basic Salary"
            type="number"
            onChange={handleChange}
            value={salaryData.basicSalary}
          />

          {/* Allowances */}
          <InputField
            name="allowances"
            label="Allowances"
            type="number"
            onChange={handleChange}
            value={salaryData.allowances}
          />

          {/* Deductions */}
          <InputField
            name="deductions"
            label="Deductions"
            type="number"
            onChange={handleChange}
            value={salaryData.deductions}
          />

          {/* Pay Date */}
          <InputField
            name="payDate"
            label="Pay Date"
            type="date"
            onChange={handleChange}
            value={salaryData.payDate}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Salary
        </button>
      </form>
    </div>
  );
};

// ✅ Reusable InputField Component
const InputField = ({ name, label, type, onChange, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      onChange={onChange}
      value={value}
      className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
      required
    />
  </div>
);

export default Add;
