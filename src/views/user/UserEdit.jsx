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
    staff_id: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      const res = await axiosClient.get(`/api/users/${id}`);
      setFormData({
        username: res.data.username,
        email: res.data.email,
        password : res.data.password,
        role_id: res.data.role_id,
        department_id: res.data.department_id,
        staff_id: res.data.staff_id ?? "",
      });
    };
    loadUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      role_id: formData.role_id ? Number(formData.role_id) : null,
      department_id: formData.department_id ? Number(formData.department_id) : null,
      staff_id: formData.staff_id ? Number(formData.staff_id) : null,
    };
    try {
      await axiosClient.put(`/api/users/${id}`, payload);
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
