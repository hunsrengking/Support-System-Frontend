import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faLock, faUserPlus } from "@fortawesome/free-solid-svg-icons";

// ChangePasswordModal - animated using simple CSS transitions
export function ChangePasswordModal({ open, onClose, userId, onSuccess }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // local visible state to allow exit animation before actually unmounting
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      // mount -> trigger enter animation
      setVisible(true);
    } else {
      // when parent closes, immediately start hiding
      setVisible(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      // reset fields after modal fully hidden
      setPassword("");
      setConfirm("");
      setError(null);
      setSuccess(null);
    }
  }, [open]);

  const validate = () => {
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirm) {
      setError("Password and confirm do not match.");
      return false;
    }
    return true;
  };

  const handleClose = () => {
    // start exit animation then call onClose after short delay
    setVisible(false);
    setTimeout(() => {
      if (typeof onClose === "function") onClose();
    }, 260); // should match the CSS transition duration below
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validate()) return;

    try {
      setLoading(true);
      // NOTE: adjust endpoint/method to match your backend if necessary
      const res = await axiosClient.patch(
        `/api/users/${userId}/change-password`,
        {
          password,
        }
      );

      setSuccess("Password changed successfully.");
      if (typeof onSuccess === "function") onSuccess(res.data);

      // automatically close after showing success briefly
      setTimeout(() => {
        // animate out
        setVisible(false);
        setTimeout(() => {
          if (typeof onClose === "function") onClose();
        }, 260);
      }, 900);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.detail || err?.response?.data || err.message;
      setError(typeof msg === "string" ? msg : "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  // keep the modal in the DOM while either open prop is true or while visible true
  if (!open && !visible) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-lg p-5 transform transition-all duration-200 ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Change Password</h3>
          {/* Close button removed per request - user will use Cancel or click outside to close */}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm text-slate-600 mb-1">
              New password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-slate-600 mb-1">
              Confirm password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
          </div>

          {error && <div className="text-sm text-red-500 mb-3">{error}</div>}
          {success && (
            <div className="text-sm text-green-600 mb-3">{success}</div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl border text-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// UsersView with integrated modal (replaces navigation to a separate route)
const UsersView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // modal state
  const [openModal, setOpenModal] = useState(false);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get(`/api/users/${id}`);
      setUser(res.data || null);
    } catch (err) {
      console.error("Failed to load user:", err);
      setError("Failed to load user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-sm text-slate-500">Loading user...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-sm text-slate-500">User not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-2">
          {/* Title */}
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faEye} />
            User Details
          </h2>
          <p className="text-sm text-slate-500">
            View profile information and manage this user.
          </p>
        </div>
      </div>

      {/* Detail Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* Breadcrumb */}
        <div className="text-sm">
          <span className="text-slate-700 font-medium">
            {user.username} {user.email}
          </span>
        </div>
        <br />
        {/* Action Buttons */}
        <div className="mb-5 flex gap-2">
          <button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm
                       font-medium rounded-xl bg-blue-600 text-white shadow-sm
                       hover:bg-blue-700 focus:outline-none focus:ring-2
                       focus:ring-blue-500/50"
          >
            <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
            Change Password
          </button>
        </div>

        {/* User Name */}
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {user.first_name} {user.last_name}
        </h3>

        {/* Info table */}
        <div className="max-w-xl">
          <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
            <tbody>
              <tr className="bg-slate-50">
                <td className="py-2 px-3 text-slate-600 w-48 border border-slate-200">
                  Login Name:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {user.username || "-"}
                </td>
              </tr>

              <tr>
                <td className="py-2 px-3 text-slate-600 border border-slate-200">
                  First Name:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {user.first_name || "-"}
                </td>
              </tr>

              <tr className="bg-slate-50">
                <td className="py-2 px-3 text-slate-600 border border-slate-200">
                  Last Name:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {user.last_name || "-"}
                </td>
              </tr>

              <tr>
                <td className="py-2 px-3 text-slate-600 border border-slate-200">
                  Email:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {user.email || "-"}
                </td>
              </tr>

              <tr className="bg-slate-50">
                <td className="py-2 px-3 text-slate-600 border border-slate-200">
                  Department:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {user.department_id || "-"}
                </td>
              </tr>

              <tr>
                <td className="py-2 px-3 text-slate-600 border border-slate-200">
                  Staff:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {user.staff_name || "-"}
                </td>
              </tr>

              <tr className="bg-slate-50">
                <td className="py-2 px-3 text-slate-600 border border-slate-200">
                  Roles:
                </td>
                <td className="py-2 px-3 border border-slate-200">
                  {Array.isArray(user.roles)
                    ? user.roles.join(", ")
                    : user.role_name || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal component injected here */}
      <ChangePasswordModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        userId={user.id}
        onSuccess={() => {
          loadUser();
        }}
      />
    </div>
  );
};

export default UsersView;
