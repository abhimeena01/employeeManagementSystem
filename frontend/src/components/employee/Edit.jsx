import React, { useEffect, useState } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Edit = () => {
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams(); // This should be employee._id from the URL route

  useEffect(() => {
    const getDepartments = async () => {
      const result = await fetchDepartments();
      setDepartments(result || []);
    };

    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          const emp = response.data.employee;

          setEmployee({
            name: emp?.userId?.name || "",
            maritalStatus: emp?.maritalStatus || "",
            designation: emp?.designation || "",
            salary: emp?.salary || 0,
            department: emp?.department?._id || "",
          });
        } else {
          alert("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Fetch Employee Error:", error);
        alert(error.response?.data?.error || "Error fetching employee.");
      } finally {
        setLoading(false);
      }
    };

    getDepartments();
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/employee/${id}`, // Ensure this is employee._id
        employee,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Employee updated successfully");
        navigate("/admin-dashboard/employees");
      } else {
        alert(response.data.error || "Failed to update employee.");
      }
    } catch (error) {
      console.error("Update employee error:", error);
      alert(
        error.response?.data?.error || "Something went wrong while updating the employee."
      );
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  if (!employee) return <div className="text-center mt-10 text-red-500">Employee not found.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField name="name" label="Name" type="text" onChange={handleChange} value={employee.name} />

          <SelectField
            name="maritalStatus"
            label="Marital Status"
            onChange={handleChange}
            value={employee.maritalStatus}
            options={[
              { value: "single", label: "Single" },
              { value: "married", label: "Married" },
            ]}
          />

          <InputField name="designation" label="Designation" type="text" onChange={handleChange} value={employee.designation} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              onChange={handleChange}
              value={employee.department}
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

          <InputField name="salary" label="Salary" type="number" onChange={handleChange} value={employee.salary} />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

// Input Field Component
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

// Select Field Component
const SelectField = ({ name, label, onChange, options, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      onChange={onChange}
      value={value}
      className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
      required
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default Edit;
