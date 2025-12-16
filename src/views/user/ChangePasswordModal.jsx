import React, { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";

const ChangePasswordModal = ({ open, onClose, userId, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // animation state
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
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
    setVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 250);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validate()) return;

    try {
      setLoading(true);
      await axiosClient.patch(`/api/users/${userId}/change-password`, {
        password,
      });

      setSuccess("Password changed successfully.");

      if (onSuccess) onSuccess();

      setTimeout(() => {
        handleClose();
      }, 800);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          err?.response?.data ||
          "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open && !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-200
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200
          ${visible ? "opacity-100" : "opacity-0"}`}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-lg p-5
          transform transition-all duration-200
          ${
            visible
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-4 scale-95 opacity-0"
          }`}
      >
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm text-slate-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-400"
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-slate-600 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-400"
              placeholder="Repeat password"
              autoComplete="new-password"
            />
          </div>

          {error && <div className="text-sm text-red-500 mb-3">{error}</div>}
          {success && (
            <div className="text-sm text-green-600 mb-3">{success}</div>
          )}

          <div className="flex justify-end gap-2 pt-2">
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
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-medium
                         bg-blue-600 text-white hover:bg-blue-700
                         disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
