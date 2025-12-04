// src/views/settings/users/UserDetail.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const UsersView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get(`/api/users/${id}`);
      setUser(res.data || null);
    } catch (err) {
      console.error("Failed to load user:", err);
      setError("Failed to load user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-sm text-slate-500">Loading user...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-sm text-slate-500">User not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col gap-2">
          {/* Breadcrumb */}
          <div className="text-sm">
            <span className="text-slate-700 font-medium">
              {user.first_name} {user.last_name}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-slate-900">User Details</h2>
          <p className="text-sm text-slate-500">
            View profile information and manage this user.
          </p>
        </div>
      </div>

      {/* Detail Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* Action Buttons */}
        <div className="mb-5 flex gap-2">
          <button
            onClick={() =>
              navigate(`/settings/users/${user.id}/change-password`)
            }
            className="inline-flex items-center gap-2 px-4 py-2 text-sm
                       font-medium rounded-xl bg-blue-600 text-white shadow-sm
                       hover:bg-blue-700 focus:outline-none focus:ring-2
                       focus:ring-blue-500/50"
          >
            <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
            Change Password
          </button>
        </div>

        {/* User Name */}
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {user.first_name} {user.last_name}
        </h3>

        {/* Info table */}
        <div className="max-w-xl">
          <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
            <tbody>
              <tr className="bg-slate-50">
                <td className="py-2 px-3 text-slate-600 w-48 border border-slate-200">
                  Login Name:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {user.username || "-"}
                </td>
              </tr>

              <tr>
                <td className="py-2 px-3 text-slate-600 border border-slate-200">
                  First Name:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {user.first_name || "-"}
                </td>
              </tr>

              <tr className="bg-slate-50">
                <td className="py-2 px-3 text-slate-600 border border-slate-200">
                  Last Name:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {user.last_name || "-"}
                </td>
              </tr>

              <tr>
                <td className="py-2 px-3 text-slate-600 border border-slate-200">
                  Email:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {user.email || "-"}
                </td>
              </tr>

              <tr className="bg-slate-50">
                <td className="py-2 px-3 text-slate-600 border border-slate-200">
                  Office:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {user.office_name || "-"}
                </td>
              </tr>

              <tr>
                <td className="py-2 px-3 text-slate-600 border border-slate-200">
                  Staff:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {user.staff_name || "-"}
                </td>
              </tr>

              <tr className="bg-slate-50">
                <td className="py-2 px-3 text-slate-600 border border-slate-200">
                  Roles:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {Array.isArray(user.roles)
                    ? user.roles.join(", ")
                    : user.role_name || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersView;
