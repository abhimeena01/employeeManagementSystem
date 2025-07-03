import React, { useEffect, useState } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments || []);
    };
    getDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/employee/add", // ✅ Corrected URL here
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Employee added successfully");
        navigate("/admin-dashboard/employees");
      } else {
        alert(response.data.error || "Failed to add employee.");
      }
    } catch (error) {
      console.error("Add employee error:", error);
      alert(
        error.response?.data?.error ||
          "Something went wrong while adding the employee."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField name="name" label="Name" type="text" onChange={handleChange} />
          <InputField name="email" label="Email" type="email" onChange={handleChange} />
          <InputField name="employeeId" label="Employee ID" type="text" onChange={handleChange} />
          <InputField name="dob" label="Date of Birth" type="date" onChange={handleChange} />
          
          <SelectField name="gender" label="Gender" onChange={handleChange} options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ]} />

          <SelectField name="maritalStatus" label="Marital Status" onChange={handleChange} options={[
            { value: "single", label: "Single" },
            { value: "married", label: "Married" },
          ]} />

          <InputField name="designation" label="Designation" type="text" onChange={handleChange} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              onChange={handleChange}
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

          <InputField name="salary" label="Salary" type="number" onChange={handleChange} />
          <InputField name="password" label="Password" type="password" onChange={handleChange} />

          <SelectField name="role" label="Role" onChange={handleChange} options={[
            { value: "admin", label: "Admin" },
            { value: "employee", label: "Employee" },
          ]} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Image Upload</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

// Reusable input field component
const InputField = ({ name, label, type, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      onChange={onChange}
      className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
      required
    />
  </div>
);

// Reusable select field component
const SelectField = ({ name, label, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      onChange={onChange}
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

export default Add;
