import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";

const DepartmentCreate = () => {
  const navigate = useNavigate();
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.post("/api/department", {
        name: departmentName,
        description,
      });
      navigate("/settings/departments");
    } catch (error) {
      console.error("Create department error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faBuilding} />
          Create New Department
        </h1>
        <p className="text-sm text-slate-500">
          Add a new department into your system.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 max-w-xl"
      >
        <div>
          <label className="text-sm text-slate-600">Department Name</label>
          <input
            type="text"
            required
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className="w-full mt-1 border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="E.g. Human Resources, Sales, IT"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Description</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Short description of this department..."
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
            onClick={() => navigate("/settings/departments")}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center gap-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentCreate;
