// src/views/settings/users/UserEdit.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import UserForm from "./UserForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";

const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role_id: "",
    department_id: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const res = await axiosClient.get(`/api/users/${id}`);
    setFormData({
      username: res.data.username,
      email: res.data.email,
      password : res.data.password,
      role_id: res.data.role_id,
      dedepartment_id: res.data.department_id,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.put(`/api/users/${id}`, formData);
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
          <FontAwesomeIcon icon={faUserEdit} />
          Edit User
        </h1>
        <p className="text-sm text-slate-500">
          Update user profile and role. Password is not changed here.
        </p>
      </div>

      <UserForm
        isEdit={true}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/users")}
      />
    </div>
  );
};

export default UserEdit;
