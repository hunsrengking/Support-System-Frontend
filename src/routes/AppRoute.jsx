// src/routes/AppRoute.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import { AuthProvider } from "../auth/auth";

import ProtectedRoute from "./ProtectedRoute";
import RequirePermission from "./RequirePermission";
import Loading from "../components/common/Loanding";
import CreateTicket from "../views/tickets/CreateTicket";
import TicketChecker from "../views/setting/checker/Checker";
import TicketCheckerView from "../views/setting/checker/CheckerView";

// Lazy-loaded pages
const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));
const Users = lazy(() => import("../views/user/User"));
const Settings = lazy(() => import("../views/setting/Settings"));

const RolePermission = lazy(() =>
  import("../views/setting/roles/RolePermission")
);
const RoleCreate = lazy(() => import("../views/setting/roles/RoleCreate"));
const RoleList = lazy(() => import("../views/setting/roles/RoleList"));

const Login = lazy(() => import("../views/auth/Login"));

const UserCreate = lazy(() => import("../views/user/UserCreate"));
const UserEdit = lazy(() => import("../views/user/UserEdit"));
const UsersView = lazy(() => import("../views/user/UserView"));

const NoPermission = lazy(() => import("../views/errors/NoPermission"));

const Ticket = lazy(() => import("../views/tickets/Ticket"));
const ViewTicket = lazy(() => import("../views/tickets/ViewTicket"));

const AppRoute = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/403" element={<NoPermission />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
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

              <Route
                path="ticket"
                element={
                  <RequirePermission perm="view_ticket">
                    <Ticket />
                  </RequirePermission>
                }
              />
              <Route
                path="/ticket/create"
                element={
                  <RequirePermission perm="view_ticket">
                    <CreateTicket />
                  </RequirePermission>
                }
              />
              <Route
                path="/ticket/views/:id"
                element={
                  <RequirePermission perm="view_ticket">
                    <ViewTicket />
                  </RequirePermission>
                }
              />
              <Route
                path="/checkermaker"
                element={
                  <RequirePermission perm="view_ticket">
                    <TicketChecker />
                  </RequirePermission>
                }
              />
              <Route
                path="/checkermaker/view"
                element={
                  <RequirePermission perm="view_ticket">
                    <TicketCheckerView />
                  </RequirePermission>
                }
              />

              <Route
                path="/users"
                element={
                  <RequirePermission perm="view_users">
                    <Users />
                  </RequirePermission>
                }
              />

              <Route
                path="/users/create"
                element={
                  <RequirePermission perm="create_users">
                    <UserCreate />
                  </RequirePermission>
                }
              />

              <Route path="/users/:id/view" element={<UsersView />} />

              <Route
                path="settings/users/:id/edit"
                element={
                  <RequirePermission perm="edit_users">
                    <UserEdit />
                  </RequirePermission>
                }
              />

              <Route
                path="setting"
                element={
                  <RequirePermission perm="view_setting">
                    <Settings />
                  </RequirePermission>
                }
              />

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

              {/* Reports (example, still commented) */}
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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoute;
