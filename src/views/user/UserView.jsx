import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faLock,
  faArrowLeft,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import ChangePasswordModal from "./ChangePasswordModal";

const UsersView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get(`/api/users/${id}`);
      setUser(res.data || null);
      console.log("USER DATA:", user);
    } catch (err) {
      console.error(err);
      setError("Failed to load user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  if (loading) {
    return <div className="text-sm text-slate-500">Loading user...</div>;
  }

  if (error || !user) {
    return (
      <div className="text-sm text-red-500">{error || "User not found"}</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm
                   flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faEye} />
            User Details
          </h1>
          <p className="text-sm text-slate-500">
            View profile information and manage user.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary group */}
          <div className="inline-flex rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm
                 bg-emerald-600 text-white hover:bg-emerald-700
                 border-r border-emerald-500"
            >
              <FontAwesomeIcon icon={faLock} />
              CHANGE PASSWORD
            </button>

            <button
              onClick={() => navigate(`/users/${id}/edit`)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm
                 bg-blue-600 text-white hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faEdit} />
              EDIT
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
          <Info label="Username" value={user.username} />
          <Info label="Email" value={user.email} />

          <Info label="First Name" value={user.staff?.firstname} />
          <Info label="Last Name" value={user.staff?.lastname} />

          <Info label="Staff" value={user.staff?.display_name} />

          <Info label="Role" value={user.role?.name} />

          <Info
            label="Status"
            value={user.is_locked === 0 ? "Active" : "Locked"}
          />
        </div>
      </div>

      {/* Password Modal */}
      <ChangePasswordModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        userId={user.id}
        onSuccess={loadUser}
      />
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <p className="text-sm font-medium text-slate-900">{value || "-"}</p>
  </div>
);

export default UsersView;
