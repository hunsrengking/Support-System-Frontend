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
  const [loading, setLoading] = useState({
    roles: true,
    departments: true,
  });

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

  useEffect(() => {
    loadRoles();
    loadDepartments();
  }, []);

  const isLoading = loading.roles || loading.departments;

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 max-w-xl"
    >
      {/* Username */}
      <div>
        <label className="text-sm text-slate-600">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username || ""}
          onChange={handleChange}
          required
          className="w-full mt-1 border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
          placeholder="Username"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm text-slate-600">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          required
          className="w-full mt-1 border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
          placeholder="user@mail.com"
        />
      </div>

      {/* Role select */}
      <div>
        <label className="text-sm text-slate-600">Role</label>
        <select
          name="role_id"
          value={formData.role_id || ""}
          onChange={handleChange}
          className="w-full mt-1 border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
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

      {/* Department select - Added just like role */}
      <div>
        <label className="text-sm text-slate-600">Department</label>
        <select
          name="department_id"
          value={formData.department_id || ""}
          onChange={handleChange}
          className="w-full mt-1 border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
          disabled={loading.departments}
        >
          <option value="">Select department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name ||
                department.department_name ||
                department.title}
            </option>
          ))}
        </select>
        {loading.departments && (
          <p className="text-xs text-slate-500 mt-1">Loading departments...</p>
        )}
      </div>

      {!isEdit && (
        <>
          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              required={!isEdit}
              className="w-full mt-1 border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Confirm Password</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation || ""}
              onChange={handleChange}
              required={!isEdit}
              className="w-full mt-1 border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm password"
            />
          </div>
        </>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEdit ? "Update User" : "Create User"}
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
