import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import StaffForm from "./StaffForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";

const StaffEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    external_id: "",
    firstname: "",
    lastname: "",
    display_name: "",
    mobile_no: "",
    join_on_date: "", 
    position_id: "",
    is_active: true,
  });

  useEffect(() => {
    const loadStaff = async () => {
      const res = await axiosClient.get(`/api/staff/${id}`);
      setFormData({
        external_id: res.data.external_id ?? "",
        firstname: res.data.firstname ?? "",
        lastname: res.data.lastname ?? "",
        display_name: res.data.display_name ?? "",
        mobile_no: res.data.mobile_no ?? "",
        join_on_date: res.data.join_on_date ?? "",
        position_id: res.data.position_id ?? "",
        is_active: res.data.is_active ?? true,
      });
    };

    loadStaff();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.put(`/api/staff/${id}`, formData);
      navigate("/settings/employees");
    } catch (err) {
      console.error("Update staff error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faUserTie} />
          Edit Staff
        </h1>
        <p className="text-sm text-slate-500">
          Update staff profile and position.
        </p>
      </div>

      <StaffForm
        isEdit={true}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/settings/employees")}
      />
    </div>
  );
};

export default StaffEdit;
