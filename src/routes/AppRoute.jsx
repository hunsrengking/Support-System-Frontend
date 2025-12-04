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
import { AuthProvider } from "../auth/auth";
import UserCreate from "../views/user/UserCreate";
import UserEdit from "../views/user/UserEdit";

import ProtectedRoute from "./ProtectedRoute";
import RequirePermission from "./RequirePermission";
import NoPermission from "../views/errors/NoPermission";
import UsersView from "../views/user/UserView";

// You must create these
// import Tickets from "../views/ticket/Tickets";
// import Reports from "../views/reports/Reports";

const AppRoute = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* 403 */}
          <Route path="/403" element={<NoPermission />} />

          {/* Protected */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route
              index
              element={
                <RequirePermission perm="view_dashboard">
                  <Dashboard />
                </RequirePermission>
              }
            />
            <Route
              path="dashboard"
              element={
                <RequirePermission perm="view_dashboard">
                  <Dashboard />
                </RequirePermission>
              }
            />

            {/* Tickets */}
            {/* <Route
              path="ticket"
              element={
                <RequirePermission perm="view_ticket">
                  <Tickets />
                </RequirePermission>
              }
            /> */}

            {/* Users list */}
            <Route
              path="users"
              element={
                <RequirePermission perm="view_users">
                  <Users />
                </RequirePermission>
              }
            />

            {/* Create user */}
            <Route
              path="settings/users/create"
              element={
                <RequirePermission perm="create_users">
                  <UserCreate />
                </RequirePermission>
              }
            />
            <Route path="settings/users/:id/view" element={<UsersView />} />

            {/* Edit user */}
            <Route
              path="settings/users/:id/edit"
              element={
                <RequirePermission perm="edit_users">
                  <UserEdit />
                </RequirePermission>
              }
            />

            {/* Setting page */}
            <Route
              path="setting"
              element={
                <RequirePermission perm="view_setting">
                  <Settings />
                </RequirePermission>
              }
            />

            {/* Roles */}
            <Route
              path="settings/roles"
              element={
                <RequirePermission perm="view_roles">
                  <RoleList />
                </RequirePermission>
              }
            />
            <Route
              path="settings/roles/create"
              element={
                <RequirePermission perm="create_roles">
                  <RoleCreate />
                </RequirePermission>
              }
            />
            <Route
              path="settings/roles/:id/permissions"
              element={
                <RequirePermission perm="edit_permissions">
                  <RolePermission />
                </RequirePermission>
              }
            />

            {/* Reports */}
            {/* <Route
              path="reports"
              element={
                <RequirePermission perm="view_reports">
                  <Reports />
                </RequirePermission>
              }
            /> */}

            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoute;
