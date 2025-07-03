import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns as baseColumns, DepartmentButtons } from "../../utils/DepartmentHelper";
import axios from "axios";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filteredDepartments,setfilteredDepartments]=useState()

  // 👇 Callback for deletion from DepartmentButtons
  const onDepartmentDelete = (id) => {
    const filtered = departments.filter(dep => dep._id !== id);
    let sno = 1;
    const updated = filtered.map(dep => ({
        ...dep,
        sno: sno++,
    }));
    setDepartments(updated);
};


  // 👇 Fetch all departments on component load
  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/department", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          let sno = 1;
          const data = response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            action: (
              <DepartmentButtons DepId={dep._id} onDepartmentDelete={onDepartmentDelete} />
            ),
          }));
          setDepartments(data);
          setfilteredDepartments(data)
        }
      } catch (error) {
        console.error("Fetch error:", error);
        if (error.response && error.response.data && !error.response.data.success) {
          alert(error.response.data.error || "Failed to fetch departments.");
        } else {
          alert("Network/server error.");
        }
      } finally {
        setDepLoading(false);
      }
    };

    fetchDepartments();
  }, []);
  const filterDepartments =(e)=>{
    const records=departments.filter((dep)=>
    dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase()))
    setfilteredDepartments(records)

  }
  return (
    <>
      {depLoading ? (
        <div className="text-center mt-10 text-lg font-semibold">Loading...</div>
      ) : (
        <div className="p-5">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold">Manage Departments</h3>
          </div>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search By Dep Name"
              className="px-4 py-0.5 border rounded"
              onChange={filterDepartments}
            />
            <Link
              to="/admin-dashboard/add-department"
              className="px-4 py-1 bg-teal-600 rounded text-white"
            >
              Add New Department
            </Link>
          </div>
          <div>
            <DataTable columns={baseColumns} data={filteredDepartments} pagination />
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
