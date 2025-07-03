import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import { EmployeeButtons } from "../../utils/EmployeeHelper";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployees] = useState([]);

  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      sortable: true,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "100px",
    },
    {
      name: "Department",
      selector: (row) => row.dep_name,
      sortable: true,
      width: "130px",
    },
    {
      name: "DOB",
      selector: (row) => row.dob,
      sortable: true,
    },
    {
      name: "Profile",
      cell: (row) =>
        row.profileImage ? (
          <img
            src={`http://localhost:5000/uploads/${row.profileImage}`}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          "N/A"
        ),
    },
    {
      name: "Action",
      cell: (row) => row.action,
    },
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            name: emp?.userId?.name || "N/A",
            dep_name: emp?.department?.dep_name || "N/A",
            dob: emp?.dob ? new Date(emp.dob).toLocaleDateString() : "N/A",
            profileImage: emp?.userId?.profileImage || null,
            action: <EmployeeButtons Id={emp._id} />,
          }));
          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch employees.");
      } finally {
        setEmpLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleFilter = (e) => {
    const keyword = e.target.value.toLowerCase();
    const records = employees.filter((emp) =>
      emp.name.toLowerCase().includes(keyword)
    );
    setFilteredEmployees(records);
  };

  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">Manage Employee</h3>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Employee Name"
          className="px-4 py-0.5 border rounded"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-1 bg-teal-600 rounded text-white"
        >
          Add New Employee
        </Link>
      </div>
      <div className="mt-6">
        <DataTable
          columns={columns}
          data={filteredEmployee}
          progressPending={empLoading}
          pagination
        />
      </div>
    </div>
  );
};

export default List;
