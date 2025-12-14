// src/views/errors/NoPermission.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/axiosClient"; 

const NoPermission = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        null;

      if (token) {
        await axiosClient.post(
          "/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        console.warn(
          "No token found in localStorage — skipping backend logout call."
        );
      }
    } catch (err) {
      console.warn(
        "Logout request failed (continuing to clear local state):",
        err
      );
    } finally {
      // clear local state
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      localStorage.removeItem("app_auth_user");
      localStorage.removeItem("permissions");
      localStorage.removeItem("refresh_token");

      // remove default axios Authorization header if present
      if (
        axiosClient &&
        axiosClient.defaults &&
        axiosClient.defaults.headers &&
        axiosClient.defaults.headers.common
      ) {
        delete axiosClient.defaults.headers.common["Authorization"];
      }

      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2">403 – Forbidden</h1>
        <p className="text-slate-600 mb-4">
          You do not have permission to access this page.
        </p>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-60"
          disabled={loggingOut}
        >
          {loggingOut ? "Logging out..." : "Go Home"}
        </button>
      </div>
    </div>
  );
};

export default NoPermission;
