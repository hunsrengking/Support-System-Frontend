// src/views/settings/staff/StaffForm.jsx
import React, { useState, useEffect } from "react";
import axiosClient from "../../../services/axiosClient";

const StaffForm = ({
  isEdit = false,
  formData,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState({
    positions: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updated = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    // ✅ auto-generate display_name (NO INPUT)
    if (name === "firstname" || name === "lastname") {
      const firstname = name === "firstname" ? value : formData.firstname || "";
      const lastname = name === "lastname" ? value : formData.lastname || "";

      updated.display_name = `${firstname} ${lastname}`.trim();
    }

    onChange(updated);
  };

  const loadPositions = async () => {
    try {
      const res = await axiosClient.get("/api/positions");
      setPositions(res.data || []);
    } catch (err) {
      console.error("Error loading positions:", err);
    } finally {
      setLoading((prev) => ({ ...prev, positions: false }));
    }
  };

  useEffect(() => {
    loadPositions();
  }, []);

  const isLoading = loading.positions;

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
    >
      {/* External ID */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">External ID</label>
        <input
          type="text"
          name="external_id"
          value={formData.external_id || ""}
          onChange={handleChange}
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
             focus:ring-2 focus:ring-blue-400"
          placeholder="EMP-001"
        />
      </div>

      {/* First Name */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="firstname"
          value={formData.firstname || ""}
          onChange={handleChange}
          required
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
             focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Last Name */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="lastname"
          value={formData.lastname || ""}
          onChange={handleChange}
          required
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
             focus:ring-2 focus:ring-blue-400flex-1 border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">Mobile No</label>
        <input
          type="text"
          name="mobile_no"
          value={formData.mobile_no || ""}
          onChange={handleChange}
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
             focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Join Date */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">
          Join Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="join_on_date"
          value={formData.join_on_date || ""}
          onChange={handleChange}
          required
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
             focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Position */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">
          Position <span className="text-red-500">*</span>
        </label>
        <select
          name="position_id"
          value={formData.position_id || ""}
          onChange={handleChange}
          required
          disabled={loading.positions}
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
             focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select position</option>
          {positions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Active */}
      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active ?? true}
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300 text-blue-600"
        />
        <label className="text-sm text-slate-600">Active</label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 text-sm"
        >
          {isEdit ? "Update" : "Create"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default StaffForm;
