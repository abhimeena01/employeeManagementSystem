import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const View = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/salary/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data && response.data.salary) {
          setSalaries(response.data.salary);
          setFilteredSalaries(response.data.salary);
        }
      } catch (error) {
        console.error("Fetch Salary Error:", error);
        alert(error.response?.data?.error || "Failed to fetch salary records.");
      }
    };

    fetchSalaries();
  }, [id]);

  const filterSalaries = (e) => {
    const q = e.target.value;
    const filteredRecords = salaries.filter((sal) =>
      (sal.employeeId?.employeeId || "").toLowerCase().includes(q.toLowerCase())
    );
    setFilteredSalaries(filteredRecords);
  };

  return (
    <>
      {filteredSalaries === null ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto p-5">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Salary History</h2>
          </div>
          <div className="flex justify-end my-3">
            <input
              type="text"
              placeholder="Search By Emp ID"
              className="border px-2 rounded-md py-1 border-gray-300"
              onChange={filterSalaries}
            />
          </div>

          {filteredSalaries.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
                <tr>
                  <th className="px-6 py-3">S.No</th>
                  <th className="px-6 py-3">Emp ID</th>
                  <th className="px-6 py-3">Basic Salary</th>
                  <th className="px-6 py-3">Allowance</th>
                  <th className="px-6 py-3">Deduction</th>
                  <th className="px-6 py-3">Net Salary</th>
                  <th className="px-6 py-3">Pay Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((salary, index) => (
                  <tr key={salary._id} className="bg-white border-b">
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">{salary.employeeId?.employeeId || "N/A"}</td>
                    <td className="px-6 py-3">{salary.basicSalary}</td>
                    <td className="px-6 py-3">{salary.allowances}</td>
                    <td className="px-6 py-3">{salary.deductions}</td>
                    <td className="px-6 py-3">{salary.netSalary}</td>
                    <td className="px-6 py-3">
                      {new Date(salary.payDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center mt-5">No salary records found.</div>
          )}
        </div>
      )}
    </>
  );
};

export default View;
