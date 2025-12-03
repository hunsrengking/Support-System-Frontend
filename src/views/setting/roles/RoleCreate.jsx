import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

const RoleCreate = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.post("/api/role", {
        name: roleName,
        description,
      });
      navigate("/settings/roles");
    } catch (error) {
      console.error("Create role error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faUserShield} />
          Create New Role
        </h1>
        <p className="text-sm text-slate-500">
          Add a new role into your system.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 max-w-xl"
      >
        <div>
          <label className="text-sm text-slate-600">Role Name</label>
          <input
            type="text"
            required
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full mt-1 border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="E.g. Administrator, Support, Manager"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Description</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Short description of this role..."
          ></textarea>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 flex items-center gap-2"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => navigate("/settings/roles")}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center gap-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleCreate;
