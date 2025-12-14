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
  const [showNotif, setShowNotif] = useState(false); // ✅ ADD
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const notifRef = useRef(null); // ✅ ADD

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]); // ✅ ADD

  // ===== USER =====
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

  // ===== LOAD NOTIFICATIONS =====
  useEffect(() => {
    const load = async () => {
      try {
        const [listRes, countRes] = await Promise.all([
          axiosClient.get("/api/notifications"),
          axiosClient.get("/api/notifications/unread-count"),
        ]);
        const cleaned = (listRes.data || []).filter(
          (n) => !isExpiredNotification(n)
        );
        setNotifications(cleaned);
        setUnreadCount(cleaned.filter((n) => !n.is_read).length);
        // setNotifications(listRes.data || []);
        // setUnreadCount(countRes.data.count || 0);
      } catch (err) {
        console.error("Notification load error:", err);
      }
    };

    load();
    // const iv = setInterval(load, 20000);
    // return () => clearInterval(iv);
  }, []);

  // ===== LOGOUT CALLBACK =====
  useEffect(() => {
    setLogoutCallback(() => {
      clearTokens();
      delete axiosClient.defaults.headers.common["Authorization"];
      navigate("/login", { replace: true });
    });
    return () => setLogoutCallback(() => {});
  }, [navigate]);

  // ===== CLICK OUTSIDE =====
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ===== TOKEN CHECK =====
  useEffect(() => {
    const check = () => {
      const token = getAccessToken();
      if (token && isTokenExpired(token)) handleForcedLogout();
    };
    check();
    const iv = setInterval(check, 30000);
    return () => clearInterval(iv);
  }, []);

  const handleForcedLogout = () => {
    clearTokens();
    delete axiosClient.defaults.headers.common["Authorization"];
    navigate("/login", { replace: true });
  };

  const handleRead = async (n) => {
    try {
      await axiosClient.put(`/api/notifications/${n.id}/read`);
      if (n.link) navigate(n.link);
      setShowNotif(false);
    } catch (err) {
      console.error("Read notification error:", err);
    }
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    setLoggingOut(true);
    try {
      const token = getAccessToken();
      if (token) {
        await axiosClient.post("/api/logout", null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
    } finally {
      clearTokens();
      delete axiosClient.defaults.headers.common["Authorization"];
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

  const isExpiredNotification = (n) => {
    const time = n.created_at
      ? new Date(n.created_at).getTime()
      : n.createdAt
      ? new Date(n.createdAt).getTime()
      : 0;

    return time && Date.now() - time > THREE_DAYS_MS;
  };

  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-200 z-20">
      <div className="flex items-center justify-between px-6 py-3.5">
        {/* Left */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            System Support
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-4 relative">
          {/* 🔔 Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif((p) => !p)}
              className="relative p-2 hover:bg-slate-100 rounded-full"
            >
              <FontAwesomeIcon icon={faBell} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-[2px] rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-lg rounded-xl py-2 z-50">
                {notifications.length === 0 && (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    No notifications
                  </div>
                )}

                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleRead(n)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${
                      !n.is_read ? "font-semibold" : "text-slate-500"
                    }`}
                  >
                    <div>{n.title}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {n.message}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu((p) => !p)}
              className="flex items-center space-x-2 hover:bg-slate-100 rounded-full px-2.5 py-1.5"
            >
              <div className="bg-blue-100 text-blue-700 rounded-full h-8 w-8 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} />
              </div>

              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs font-medium">{user.name}</span>
                <span className="text-[11px] text-slate-500">{user.role}</span>
              </div>
            </button>

            <div
              className={`absolute right-0 mt-2 w-52 bg-white  shadow rounded-xl py-2 transition ${
                showUserMenu ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <Link
                to={`/users/${user.id}/view`}
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
                className="flex w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
