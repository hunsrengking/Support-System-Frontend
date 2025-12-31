// src/views/settings/users/UserCreate.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import UserForm from "./UserForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const UserCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role_id: "",
    department_id: "",
    staff_id: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert empty strings to null for backend
    const payload = {
      ...formData,
      role_id: formData.role_id ? Number(formData.role_id) : null,
      department_id: formData.department_id ? Number(formData.department_id) : null,
      staff_id: formData.staff_id ? Number(formData.staff_id) : null,
    };

    try {
      await axiosClient.post("/api/users", payload);
      navigate("/users");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faUserPlus} />
          Create User
        </h1>
        <p className="text-sm text-slate-500">
          Add a new user with login credentials.
        </p>
      </div>

      <UserForm
        isEdit={false}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/users")}
      />
    </div>
  );
};

export default UserCreate;
