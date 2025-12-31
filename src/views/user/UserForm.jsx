// src/views/settings/users/UserForm.jsx
import React, { useState, useEffect } from "react";
import axiosClient from "../../services/axiosClient";

const UserForm = ({
  isEdit = false,
  formData,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState({
    roles: true,
    departments: true,
    staffs: true,
  });
  const [isStaff, setIsStaff] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const loadRoles = async () => {
    try {
      const res = await axiosClient.get("/api/role");
      setRoles(res.data || []);
    } catch (err) {
      console.error("Error loading roles:", err);
    } finally {
      setLoading((prev) => ({ ...prev, roles: false }));
    }
  };

  const loadDepartments = async () => {
    try {
      const res = await axiosClient.get("/api/department");
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Error loading departments:", err);
    } finally {
      setLoading((prev) => ({ ...prev, departments: false }));
    }
  };

  const loadStaffs = async () => {
    try {
      const res = await axiosClient.get("/api/staff");
      setStaffs(res.data || []);
    } catch (err) {
      console.error("Error loading staff:", err);
    } finally {
      setLoading((prev) => ({ ...prev, staffs: false }));
    }
  };

  useEffect(() => {
    loadRoles();
    loadDepartments();
    loadStaffs();
  }, []);

  const isLoading = loading.roles || loading.departments;

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
    >
      {/* Username */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="username"
          value={formData.username || ""}
          onChange={handleChange}
          required
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
             focus:ring-2 focus:ring-blue-400"
          placeholder="Username"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          required
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
             focus:ring-2 focus:ring-blue-400"
          placeholder="user@mail.com"
        />
      </div>

      {/* Role select */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">
          Role <span className="text-red-500">*</span>
        </label>
        <select
          name="role_id"
          value={formData.role_id || ""}
          onChange={handleChange}
          required
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
             focus:ring-2 focus:ring-blue-400"
          disabled={loading.roles}
        >
          <option value="">Select role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name || role.role_name || role.title}
            </option>
          ))}
        </select>
        {loading.roles && (
          <p className="text-xs text-slate-500 mt-1">Loading roles...</p>
        )}
      </div>

      {/* Is Staff Checkbox */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          checked={isStaff}
          onChange={(e) => {
            setIsStaff(e.target.checked);
            if (!e.target.checked) {
              // Clear staff and department when unchecked
              onChange({ ...formData, staff_id: "", department_id: "" });
            }
          }}
          id="isStaff"
        />
        <label htmlFor="isStaff" className="text-sm text-slate-600">
          Is Staff
        </label>
      </div>

      {/* Staff and Department selects (only show if isStaff is true) */}
      {isStaff && (
        <>
          {/* Staff select */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
            <label className="text-sm text-slate-600 sm:w-32">
              Staff <span className="text-red-500">*</span>
            </label>
            <select
              name="staff_id"
              value={formData.staff_id || ""}
              onChange={handleChange}
              required={isStaff}
              className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
               focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select staff</option>
              {staffs.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.display_name || `${staff.firstname} ${staff.lastname}`}
                </option>
              ))}
            </select>
          </div>

          {/* Department select */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
            <label className="text-sm text-slate-600 sm:w-32">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department_id"
              value={formData.department_id || ""}
              onChange={handleChange}
              required={isStaff}
              className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
             focus:ring-2 focus:ring-blue-400"
              disabled={loading.departments}
            >
              <option value="">Select department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name || department.department_name || department.title}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Password fields only when create */}
      {!isEdit && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm text-slate-600 sm:w-32">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              required
              className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
             focus:ring-2 focus:ring-blue-400"
              placeholder="Enter password"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm text-slate-600 sm:w-32">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation || ""}
              onChange={handleChange}
              required
              className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
             focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm password"
            />
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

export default UserForm;
