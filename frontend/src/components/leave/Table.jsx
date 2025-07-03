import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { columns, LeaveButtons } from "../../utils/LeaveHepler";

const Table = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeave = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leave", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        let sno = 1;
        const data = response.data.leaves.map((leave) => ({
          _id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId?.employeeId || "N/A",
          name: leave.employeeId?.userId?.name || "N/A",
          leaveType: leave.leaveType || "N/A",
          department: leave.employeeId?.department?.dep_name || "N/A",
          day:
            Math.ceil(
              (new Date(leave.endDate) - new Date(leave.startDate)) /
                (1000 * 60 * 60 * 24)
            ) + 1,
          status: leave.status || "Pending",
          action: <LeaveButtons Id={leave._id} />,
        }));

        setLeaves(data);
        setFilteredLeaves(data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch leave records.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeave();
  }, []);

  const filterByInput = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = leaves.filter((leave) =>
      leave.employeeId.toLowerCase().includes(value)
    );
    setFilteredLeaves(filtered);
  };

  const filterByStatus = (status) => {
    const filtered = leaves.filter((leave) => leave.status === status);
    setFilteredLeaves(filtered);
  };

  return (
    <>
      {loading ? (
        <div className="text-center mt-6">Loading...</div>
      ) : (
        <div className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold">Manage Leaves</h3>
          </div>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search by Emp Id"
              onChange={filterByInput}
              className="px-4 py-1 border rounded"
            />
            <div className="space-x-2">
              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => filterByStatus("Pending")}
              >
                Pending
              </button>
              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => filterByStatus("Approved")}
              >
                Approved
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => filterByStatus("Rejected")}
              >
                Rejected
              </button>
              <button
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setFilteredLeaves(leaves)}
              >
                All
              </button>
            </div>
          </div>
          <div className="mt-3">
            <DataTable columns={columns} data={filteredLeaves} pagination />
          </div>
        </div>
      )}
    </>
  );
};

export default Table;
 