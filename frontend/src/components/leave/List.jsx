import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import axios from "axios";

const List = () => {
  const { user } = useAuth();
  const { id: paramId } = useParams(); // ✅ Correct param name
  const [leaves, setLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Use paramId only if admin, else use logged-in user._id
  const id = user.role === "admin" ? paramId : user._id;

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/leave/user/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setLeaves(response.data.leaves);
        }
      } catch (error) {
        console.error("Fetch Leave Error:", error);
        alert(error.response?.data?.error || "Failed to fetch leave records.");
      }
    };

    if (id) {
      fetchLeaves();
    }
  }, [id]);

  const filteredLeaves = leaves.filter((leave) =>
    leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Leaves</h3>
      </div>

      <div className="flex justify-between items-center my-4">
        <input
          type="text"
          placeholder="Search By Leave Type"
          className="px-4 py-1 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {user.role === "employee" && (
          <Link
            to="/employee-dashboard/add-leave"
            className="px-4 py-1 bg-teal-600 hover:bg-teal-700 rounded text-white"
          >
            Add New Leave
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border mt-6">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">S.No</th>
              <th className="px-6 py-3">Leave Type</th>
              <th className="px-6 py-3">From</th>
              <th className="px-6 py-3">To</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((leave, index) => (
              <tr key={leave._id} className="bg-white border-b">
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3">{leave.leaveType || "N/A"}</td>
                <td className="px-6 py-3">
                  {leave.startDate
                    ? new Date(leave.startDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-3">
                  {leave.endDate
                    ? new Date(leave.endDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-3">{leave.reason || "N/A"}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      leave.status === "Approved"
                        ? "bg-green-500"
                        : leave.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {leave.status || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
            {filteredLeaves.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center px-6 py-4">
                  No leave records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
