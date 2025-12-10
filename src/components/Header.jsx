// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient, {
  getAccessToken,
  isTokenExpired,
  clearTokens,
  setLogoutCallback,
} from "../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Header = ({ toggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Read stored user safely
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("app_auth_user")) || null;
    } catch {
      return null;
    }
  })();

  const user = {
    id: storedUser?.id || "id",
    name: storedUser?.username || storedUser?.name || "User",
    role: storedUser?.role?.name || storedUser?.role || "Role",
    permissions: Array.isArray(storedUser?.permissions)
      ? storedUser.permissions.map((p) => p.name)
      : [],
  };

  // Register logout callback so axiosClient can notify the app when refresh fails
  useEffect(() => {
    setLogoutCallback(() => {
      // ensure cleanup and navigation
      clearTokens();
      if (
        axiosClient.defaults &&
        axiosClient.defaults.headers &&
        axiosClient.defaults.headers.common
      ) {
        delete axiosClient.defaults.headers.common["Authorization"];
      }
      navigate("/login", { replace: true });
    });

    // cleanup: reset to noop on unmount
    return () => setLogoutCallback(() => {});
  }, [navigate]);

  // Close menu when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Auto-logout if token expired (check on mount + poll)
  useEffect(() => {
    const checkAndLogoutIfExpired = () => {
      const token = getAccessToken();
      if (!token) return;
      if (isTokenExpired(token)) {
        handleForcedLogout();
      }
    };

    checkAndLogoutIfExpired();
    const iv = setInterval(checkAndLogoutIfExpired, 30_000); // every 30s
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleForcedLogout = () => {
    clearTokens();
    if (
      axiosClient.defaults &&
      axiosClient.defaults.headers &&
      axiosClient.defaults.headers.common
    ) {
      delete axiosClient.defaults.headers.common["Authorization"];
    }
    navigate("/login", { replace: true });
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    setLoggingOut(true);

    try {
      const token = getAccessToken();
      if (token) {
        await axiosClient.post("/logout", null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.warn(
        "Logout request failed (continuing to clear local state):",
        err
      );
    } finally {
      clearTokens();
      if (
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
          <div className="relative" ref={menuRef}>
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

            {/* Animated menu: scale + fade */}
            <div
              className={`origin-top-right absolute right-0 mt-2 w-52 bg-white border border-slate-200 shadow-lg rounded-xl py-2 transform transition-all duration-150 ${
                showUserMenu
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
              }`}
              aria-hidden={!showUserMenu}
            >
              <Link
                to={`/users/${user.id}/view`}
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
                disabled={loggingOut}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  loggingOut ? "text-gray-400" : "text-red-600 hover:bg-red-50"
                }`}
                aria-busy={loggingOut}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
