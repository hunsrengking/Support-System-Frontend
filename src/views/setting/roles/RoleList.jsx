// src/views/settings/roles/RoleList.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faPlus,
  faKey,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../../../utils/permission";

const RoleList = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = async () => {
    try {
      const res = await axiosClient.get("/api/role");
      setRoles(res.data || []);
    } catch (err) {
      console.error("Error loading roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleDisable = async (id) => {
    if (!window.confirm("Disable this role?")) return;

    try {
      await axiosClient.delete(`/api/role/${id}`);
      setRoles((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete role error:", err);
    }
  };

  if (loading)
    return <p className="text-sm text-slate-500">Loading roles...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faUserShield} />
            Roles & Permissions
          </h1>
          <p className="text-sm text-slate-500">
            Manage all roles and assign permissions.
          </p>
        </div>
        {hasPermission("CREATE_ROLES") && (
          <Link
            to="/settings/roles/create"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl shadow hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faPlus} />
            Create Role
          </Link>
        )}
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        {roles.length === 0 ? (
          <p className="text-sm text-slate-500">No roles found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2 pr-4">#</th>
                  <th className="py-2 pr-4">Role Name</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => (
                  <tr
                    key={role.id}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="py-2 pr-4">{index + 1}</td>
                    <td className="py-2 pr-4 font-medium text-slate-800">
                      {role.name}
                    </td>
                    <td className="py-2 pr-4 text-slate-600">
                      {role.description || "-"}
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex justify-end gap-2">
                        {hasPermission("UPDATE_PERMISSIONS") && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/settings/roles/${role.id}/permissions`)
                            }
                            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center gap-1"
                          >
                            <FontAwesomeIcon icon={faKey} />
                            Permissions
                          </button>
                        )}
                        {hasPermission("DISABLE_ROLES") && (
                          <button
                            type="button"
                            onClick={() => handleDisable(role.id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            Disable
                          </button>
                        )}
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

export default RoleList;
