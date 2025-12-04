// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Header = ({ toggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("app_auth_user")) || null;
    } catch {
      return null;
    }
  })();

  const user = {
    name: storedUser?.username || storedUser?.name || "User",
    role: storedUser?.role?.name || "Role",
    // permissions is an array in your login response
    permissions: Array.isArray(storedUser?.permissions)
      ? storedUser.permissions.map((p) => p.name)
      : [],
  };

  const handleLogout = async () => {
    try {
      // call server logout if available, ignore errors
      await axiosClient.post("/api/logout").catch(() => {});

      // remove the same keys you saved during login
      localStorage.removeItem("access_token");
      localStorage.removeItem("app_auth_user");
      localStorage.removeItem("permissions");

      // optionally you may force a full reload to reset app state:
      // window.location.href = "/login";
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-200 z-20">
      <div className="flex items-center justify-between px-6 py-3.5">
        {/* Left */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle sidebar"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5 text-slate-700" />
          </button>

          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            System Support
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-4 relative">
          {/* Notifications */}
          <button
            className="relative p-2 hover:bg-slate-100 rounded-full"
            aria-label="Notifications"
          >
            <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-[2px] rounded-full">
              5
            </span>
          </button>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center space-x-2 hover:bg-slate-100 rounded-full px-2.5 py-1.5"
              aria-haspopup="true"
              aria-expanded={showUserMenu}
            >
              <div className="bg-blue-100 text-blue-700 rounded-full h-8 w-8 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} />
              </div>

              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs font-medium text-slate-800">
                  {user.name}
                </span>
                <span className="text-[11px] text-slate-500">{user.role}</span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 shadow-lg rounded-xl py-2">
                {/* Use Link for navigation, and close the menu when clicked */}
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm hover:bg-blue-50"
                >
                  Profile
                </Link>

                <Link
                  to="/setting"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm hover:bg-blue-50"
                >
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
