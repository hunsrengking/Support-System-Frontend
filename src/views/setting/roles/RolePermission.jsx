// src/views/settings/roles/RolePermission.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const RolePermission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    loadRole();
    loadPermissions();
  }, []);

  const loadRole = async () => {
    const res = await axiosClient.get(`/api/role/${id}`);
    setRole(res.data);

    const selectedIds = (res.data.permissions || []).map((p) => Number(p.id));

    setSelected(selectedIds);
  };

  const loadPermissions = async () => {
    const res = await axiosClient.get("/api/permissions");
    setPermissions(res.data || []);
  };

  const toggleSelect = (permissionId) => {
    setSelected((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const saveAssign = async () => {
    await axiosClient.put(`/api/role/${id}/permissions`, {
      permissions: selected,
    });
    navigate("/settings/roles");
  };

  if (!role) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faKey} />
          Assign Permissions - {role.name}
        </h1>
        <p className="text-sm text-slate-500">
          Select which permissions this role will have.
        </p>
      </div>
      {/* Permission List */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {permissions.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-3 p-3 border rounded-xl hover:bg-blue-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(p.id)}
                onChange={() => toggleSelect(p.id)}
              />
              <span className="text-sm">{p.name}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={saveAssign}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 flex items-center gap-2"
          >
            Submit
          </button>

          <button
            onClick={() => navigate("/settings/roles")}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
        </div>
      </div>
    </div>
  );
};
export default RolePermission;
