// LeaveTableHelper.js

import { useNavigate } from "react-router-dom";

// Leave Action Buttons Component
export const LeaveButtons = ({ Id }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/admin-dashboard/leaves/${Id}`);
  };

  return (
    <button
      className="px-4 py-1 bg-teal-500 rounded text-white hover:bg-teal-600"
      onClick={handleView}
    >
      View
    </button>
  );
};

// Columns for DataTable
export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "140px",
  },
  {
    name: "Emp ID",
    selector: (row) => row.employeeId,
    width: "140px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    width: "140px",
  },
  {
    name: "Leave Type",
    selector: (row) => row.leaveType,
    width: "170px",
  },
  {
    name: "Department",
    selector: (row) => row.department,
    width: "160px",
  },
  {
    name: "Days",
    selector: (row) => row.day,
    width: "140px",
  },
  {
    name: "Status",
    selector: (row) => row.status,
    width: "150px",
  },
  {
    name: "Action",
    cell: (row) => <LeaveButtons Id={row._id} />,
    //center: true,
    width: "140px",
  },
];
