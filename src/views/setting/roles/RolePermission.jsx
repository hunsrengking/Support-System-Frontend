// src/views/settings/roles/RolePermission.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faArrowLeft,
  faCheckSquare,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";

const RolePermission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);

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
    const data = res.data || [];
    setPermissions(data);

    if (data.length > 0) {
      setActiveGroup(data[0].group);
    }
  };

  /* ======================
     Group permissions
  ====================== */
  const groupedPermissions = permissions.reduce((acc, p) => {
    const groupName = p.group || "General";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(p);
    return acc;
  }, {});

  const groups = Object.keys(groupedPermissions);

  /* ======================
     Toggle permission
  ====================== */
  const toggleSelect = (permissionId) => {
    setSelected((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  /* ======================
     Select / Deselect (ACTIVE GROUP)
  ====================== */
  const selectAllActiveGroup = () => {
    const ids = (groupedPermissions[activeGroup] || []).map((p) => p.id);
    setSelected((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const deselectAllActiveGroup = () => {
    const ids = (groupedPermissions[activeGroup] || []).map((p) => p.id);
    setSelected((prev) => prev.filter((id) => !ids.includes(id)));
  };

  /* ======================
     Save
  ====================== */
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
          Click a group to view permissions.
        </p>
      </div>

      {/* Side by Side */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex min-h-[420px]">
        {/* LEFT: GROUP LIST */}
        <div className="w-1/3 border-r-2 border-slate-300">
          <div className="p-4 font-semibold border-b text-slate-700">
            Permission Groups
          </div>

          {groups.map((group) => (
            <div
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`px-4 py-3 cursor-pointer text-sm 
                ${
                  activeGroup === group
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-slate-100"
                }`}
            >
              {group}
            </div>
          ))}
        </div>

        {/* RIGHT: PERMISSIONS */}
        <div className="w-2/3 p-5">
          {/* Header + Buttons */}
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="text-sm font-semibold text-slate-700 uppercase">
              Permissions : {activeGroup}
            </h3>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAllActiveGroup}
                className="text-xs px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faCheckSquare} />
                Select All
              </button>

              <button
                type="button"
                onClick={deselectAllActiveGroup}
                className="text-xs px-3 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faSquare} />
                Deselect All
              </button>
            </div>
          </div>

          {/* Permission List */}
          <div className="space-y-3">
            {(groupedPermissions[activeGroup] || []).map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggleSelect(p.id)}
                />
                <span className="text-sm">{p.name.replace(/_/g, " ")}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={saveAssign}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700"
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
  );
};

export default RolePermission;
