import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEdit,
  faTrash,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../../../utils/permission";
import axiosClient from "../../../services/axiosClient";

const Staff = () => {
  const navigate = useNavigate();

  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadStaffs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/staff");
      setStaffs(res.data || []);
    } catch (err) {
      console.error("Error loading staff:", err);
      setError("Failed to load staff. Please try again.");
      setStaffs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaffs();
  }, []);

  const handleAddStaff = () => {
    navigate("/settings/employees/create");
  };

  const handleEditStaff = (id) => {
    navigate(`/settings/employees/${id}/edit`);
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;

    try {
      await axiosClient.delete(`/api/staff/${id}`);
      setStaffs((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting staff:", err);
      alert("Failed to delete staff.");
    }
  };

  const handleViewStaff = (id) => {
    navigate(`/settings/employees/${id}/view`);
  };

  const filteredStaffs = staffs.filter(
    (s) =>
      s.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mobile_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
              <FontAwesomeIcon icon={faUserTie} />
              Staff Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage staff information and positions.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl
                           focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                           placeholder:text-slate-400 outline-none"
              />
            </div>

            {hasPermission("CREATE_STAFF") && (
              <button
                onClick={handleAddStaff}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm
                         font-medium rounded-xl bg-blue-600 text-white shadow-sm
                         hover:bg-blue-700 focus:outline-none focus:ring-2
                         focus:ring-blue-500/50"
              >
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                <span>Add Staff</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">First Name</th>
                <th className="px-4 py-3">Last Name</th>
                <th className="px-4 py-3">Display Name</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    Loading staff...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-red-500"
                  >
                    {error}
                    <button
                      onClick={loadStaffs}
                      className="ml-2 text-blue-600 underline"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : filteredStaffs.length > 0 ? (
                filteredStaffs.map((s) => (
                  <tr
                    key={s.id}
                    onClick={
                      hasPermission("VIEW_STAFF")
                        ? () => handleViewStaff(s.id)
                        : undefined
                    }
                    className={`transition-colors
                      ${
                        hasPermission("VIEW_STAFF")
                          ? "hover:bg-slate-50 cursor-pointer"
                          : "cursor-not-allowed opacity-60"
                      }`}
                  >
                    <td className="px-4 py-3 font-medium">{s.id}</td>
                    <td className="px-4 py-3">{s.firstname || "-"}</td>
                    <td className="px-4 py-3">{s.lastname || "-"}</td>
                    <td className="px-4 py-3">{s.display_name || "-"}</td>
                    <td className="px-4 py-3">{s.mobile_no || "-"}</td>
                    <td className="px-4 py-3">{s.position_title || "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium
                          ${
                            s.is_active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-gray-200 text-gray-700 border border-gray-300"
                          }`}
                      >
                        {s.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div
                        className="inline-flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {hasPermission("UPDATE_STAFF") && (
                          <button
                            onClick={() => handleEditStaff(s.id)}
                            className="w-8 h-8 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        )}
                        {hasPermission("DELETE_STAFF") && (
                          <button
                            onClick={() => handleDeleteStaff(s.id)}
                            className="w-8 h-8 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    No staff found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between">
          <span>
            Showing {filteredStaffs.length} of {staffs.length} staff
          </span>
          <span className="text-slate-400">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};

export default Staff;
