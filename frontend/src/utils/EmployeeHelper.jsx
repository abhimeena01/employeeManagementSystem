import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🔘 Action Buttons Component for each Employee row
export const EmployeeButtons = ({ Id }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    if (!Id) return alert("Invalid employee ID");
    navigate(`/admin-dashboard/employees/${path}/${Id}`);
  };

  return (
    <div className="flex space-x-2">
      <button
        className="px-2 py-1 bg-teal-600 text-white text-sm rounded"
        onClick={() => handleNavigate("view")}
      >
        View
      </button>
      <button
        className="px-2 py-1 bg-blue-600 text-white text-sm rounded"
        onClick={() => handleNavigate("edit")}
      >
        Edit
      </button>
      <button
        className="px-2 py-1 bg-yellow-600 text-white text-sm rounded"
        onClick={() => handleNavigate("salary")}
      >
        Salary
      </button>
      <button
        className="px-2 py-1 bg-red-600 text-white text-sm rounded"
        onClick={() => navigate(`/admin-dashboard/employee/leaves/${Id}`)}
      >
        Leave
      </button>
    </div>
  );
};

// 📊 Columns for Employee DataTable
export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Name",
    selector: (row) => row.name || "N/A",
    sortable: true,
    width: "100px",
  },
  {
    name: "Image",
    width: "90px",
    selector: (row) =>
      row.profileImage ? (
        <img
          src={`http://localhost:5000/uploads/${row.profileImage}`}
          alt="Profile"
          className="h-10 w-10 object-cover rounded-full"
        />
      ) : (
        <span>N/A</span>
      ),
  },
  {
    name: "Department",
    selector: (row) =>
      row.department?.dep_name ? row.department.dep_name : "N/A",
    width: "120px",
  },
  {
    name: "DOB",
    selector: (row) =>
      row.dob ? new Date(row.dob).toLocaleDateString() : "N/A",
    sortable: true,
    width: "130px",
  },
  {
    name: "Action",
    selector: (row) => <EmployeeButtons Id={row._id} />,
    center: true,
  },
];

// 🏢 Fetch departments for dropdown or mapping
export const fetchDepartments = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data.success) {
      return response.data.departments;
    } else {
      console.warn("Failed to fetch departments:", response.data.error);
      return [];
    }
  } catch (error) {
    console.error("Fetch departments error:", error);
    alert(
      error.response?.data?.error ||
        "Failed to fetch departments. Server/network error."
    );
    return [];
  }
};

// ✅ Fixed getEmployees to expect department _id
export const getEmployees = async (departmentId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/employee/department/${departmentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.success) {
      return response.data.employees;
    } else {
      console.warn("Failed to fetch employees:", response.data.error);
      return [];
    }
  } catch (error) {
    console.error("Fetch employees error:", error);
    alert(
      error.response?.data?.error ||
        "Failed to fetch employees. Server/network error."
    );
    return [];
  }
};
