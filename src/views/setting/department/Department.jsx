// src/views/settings/department/Department.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faPlus,
  faUsers,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const DepartmentList = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDepartments = async () => {
    try {
      const res = await axiosClient.get("/api/department");
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Error loading departments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleDisable = async (id) => {
    if (!window.confirm("Disable this department?")) return;

    try {
      await axiosClient.delete(`/api/department/${id}`);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Delete department error:", err);
    }
  };

  if (loading)
    return <p className="text-sm text-slate-500">Loading departments...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faBuilding} />
            Departments
          </h1>
          <p className="text-sm text-slate-500">
            Manage all departments and their details.
          </p>
        </div>

        <Link
          to="/settings/department/create"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl shadow hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faPlus} />
          Create Department
        </Link>
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        {departments.length === 0 ? (
          <p className="text-sm text-slate-500">No departments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2 pr-4">#</th>
                  <th className="py-2 pr-4">Department Name</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, index) => (
                  <tr
                    key={dept.id}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="py-2 pr-4">{index + 1}</td>
                    <td className="py-2 pr-4 font-medium text-slate-800">
                      {dept.name}
                    </td>
                    <td className="py-2 pr-4 text-slate-600">
                      {dept.description || "-"}
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/settings/department/${dept.id}/members`)
                          }
                          className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faUsers} />
                          Members
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDisable(dept.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          Disable
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentList;
