import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Info = ({ label, value }) => (
  <p><span className="font-semibold">{label}:</span> {value || "N/A"}</p>
);

const Detail = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/leave/detail/${id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (res.data.success) setLeave(res.data.leave);
      } catch (err) {
        console.error("Fetch Leave Error:", err);
        alert("Failed to fetch leave details.");
      }
    };
    fetchLeave();
  }, [id]);

  const changeStatus = async (leaveId, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/leave/status/${leaveId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.success) navigate("/admin-dashboard/leaves");
    } catch (err) {
      console.error("Update Leave Error:", err);
      alert(err.response?.data?.error || "Failed to update leave status.");
    }
  };

  return leave ? (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-8 text-center">Leave Details</h2>
      <div className="flex items-center justify-around flex-wrap">
        <img
          src={
            leave.employeeId?.userId?.profileImage
              ? `http://localhost:5000/uploads/${leave.employeeId.userId.profileImage}`
              : "/default-profile.png"
          }
          alt="Profile"
          className="w-52 h-52 object-cover rounded-full border"
        />
        <div className="space-y-3 mt-5 md:mt-0">
          <Info label="Name" value={leave.employeeId?.userId?.name} />
          <Info label="Email" value={leave.employeeId?.userId?.email} />
          <Info label="Leave Type" value={leave.leaveType} />
          <Info label="Reason" value={leave.reason} />
          <Info label="Department" value={leave.employeeId?.department?.dep_name} />
          <Info
            label="Start Date"
            value={new Date(leave.startDate).toLocaleDateString()}
          />
          <Info
            label="End Date"
            value={new Date(leave.endDate).toLocaleDateString()}
          />
          <Info label="Gender" value={leave.employeeId?.gender} />
          <Info label="Marital Status" value={leave.employeeId?.maritalStatus} />

          <div className="mt-4">
            <p className="text-lg font-bold">
              {leave.status === "Pending" ? "Action:" : "Status:"}
            </p>
            {leave.status === "Pending" ? (
              <div className="flex space-x-2 mt-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => changeStatus(leave._id, "Approved")}
                >
                  Approve
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => changeStatus(leave._id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            ) : (
              <p className="font-medium">{leave.status}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center mt-10">Loading...</div>
  );
};

export default Detail;
