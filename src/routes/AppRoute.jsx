// src/routes/AppRoute.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import Dashboard from "../views/dashboard/Dashboard";
import Users from "../views/user/User";
import Settings from "../views/setting/Settings";
import RolePermission from "../views/setting/roles/RolePermission";
import RoleCreate from "../views/setting/roles/RoleCreate";
import RoleList from "../views/setting/roles/RoleList";
import Login from "../views/auth/Login";
import { AuthProvider, useAuth } from "../auth/auth";
import UserCreate from "../views/user/UserCreate";
import UserEdit from "../views/user/UserEdit";

// Protect route component
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 text-sm">Checking session...</div>
      </div>
    );
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoute = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="/settings/users/create" element={<UserCreate />} />
            <Route path="/settings/users/:id/edit" element={<UserEdit />} />
            <Route path="setting" element={<Settings />} />
            <Route path="settings/roles" element={<RoleList />} />
            <Route path="settings/roles/create" element={<RoleCreate />} />
            <Route
              path="settings/roles/:id/permissions"
              element={<RolePermission />}
            />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoute;
