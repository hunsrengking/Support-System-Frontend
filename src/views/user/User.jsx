// src/views/settings/users/Users.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEdit,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../../utils/permission";

const Users = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = () => {
    navigate("/users/create"); // ➜ page with password input
  };

  const handleEditUser = (id) => {
    navigate(`/users/${id}/edit`); // ➜ page WITHOUT password input
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axiosClient.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      // alert("Failed to delete user.");
    }
  };

  // New: view user detail
  const handleViewUser = (id) => {
    navigate(`/users/${id}/view`);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header + Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Title */}

          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
              <FontAwesomeIcon icon={faUser} />
              User Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage user accounts, roles, and statuses.
            </p>
          </div>

          {/* Search + Add button */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl
                           focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                           placeholder:text-slate-400 outline-none"
              />
            </div>

            {hasPermission("CREATE_USER") && (
              <button
                onClick={handleAddUser}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm
                         font-medium rounded-xl bg-blue-600 text-white shadow-sm
                         hover:bg-blue-700 focus:outline-none focus:ring-2
                         focus:ring-blue-500/50"
              >
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                <span>Add User</span>
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
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-red-500"
                  >
                    {error}
                    <button
                      onClick={loadUsers}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    onClick={
                      hasPermission("VIEW_USER")
                        ? () => handleViewUser(u.id)
                        : undefined
                    }
                    className={`transition-colors duration-150
    ${
      hasPermission("VIEW_USER")
        ? "hover:bg-slate-50 cursor-pointer"
        : "cursor-not-allowed opacity-60"
    }`}
                  >
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {u.id}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {u.username || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {u.email || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {u.role_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {u.department_name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                          ${
                            u.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : u.status === "Locked"
                              ? "bg-gray-200 text-gray-700 border border-gray-300"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5
                            ${
                              u.status === "Active"
                                ? "bg-emerald-500"
                                : u.status === "Locked"
                                ? "bg-gray-500"
                                : "bg-red-500"
                            }`}
                        />
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div
                        className="inline-flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {hasPermission("UPDATE_USER") && (
                          <button
                            onClick={() => handleEditUser(u.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                     text-slate-500 hover:text-blue-600 hover:bg-blue-50
                                     transition-colors"
                            aria-label="Edit user"
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                              className="h-4 w-4"
                            />
                          </button>
                        )}
                        {hasPermission("DELETE_USER") && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                     text-slate-500 hover:text-red-600 hover:bg-red-50
                                     transition-colors"
                            aria-label="Delete user"
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="h-4 w-4"
                            />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {searchTerm
                      ? "No users match your search."
                      : "No users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center">
          <span>
            Showing {filteredUsers.length} of {users.length} users
          </span>
          <span className="text-slate-400">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};

export default Users;
