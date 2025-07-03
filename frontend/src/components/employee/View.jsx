import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const View = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setEmployee(response.data.employee); // ❗ corrected from response.data.employees
        } else {
          throw new Error("Employee not found");
        }
      } catch (error) {
        console.error("Fetch Employee Error:", error);
        alert(
          error.response?.data?.error || "Something went wrong while fetching employee details."
        );
      }
    };

    if (id) fetchEmployee();
  }, [id]);

  return (
    <>
      {employee ? (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-8 text-center">Employee Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={
                  employee.userId?.profileImage
                    ? `http://localhost:5000/uploads/${employee.userId.profileImage}`
                    : "/default-profile.png"
                }
                alt="profile"
                className="rounded-full border w-72 h-72 object-cover"
              />
            </div>
            <div>
              <Info label="Name" value={employee.userId?.name} />
              <Info label="Employee ID" value={employee.employeeId} />
              <Info
                label="Date of Birth"
                value={employee.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}
              />
              <Info label="Gender" value={employee.gender} />
              <Info label="Department" value={employee.department?.dep_name || "N/A"} />
              <Info label="Marital Status" value={employee.maritalStatus} />
              <Info label="Designation" value={employee.designation} />
              <Info label="Salary" value={`₹ ${employee.salary}`} />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-lg font-semibold mt-10">Loading...</div>
      )}
    </>
  );
};

const Info = ({ label, value }) => (
  <div className="flex space-x-3 mb-5">
    <p className="text-lg font-bold">{label}:</p>
    <p className="font-medium">{value || "N/A"}</p>
  </div>
);

export default View;
