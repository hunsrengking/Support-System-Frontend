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
                  <RequirePermission perm="VIEW_DASHBOARD">
                    <Dashboard />
                  </RequirePermission>
                }
              />
              <Route
                path="dashboard"
                element={
                  <RequirePermission perm="VIEW_DASHBOARD">
                    <Dashboard />
                  </RequirePermission>
                }
              />

              <Route
                path="ticket"
                element={
                  <RequirePermission perm="VIEW_TICKET">
                    <Ticket />
                  </RequirePermission>
                }
              />
              <Route
                path="/ticket/create"
                element={
                  <RequirePermission perm="VIEW_TICKET">
                    <CreateTicket />
                  </RequirePermission>
                }
              />
              <Route
                path="/ticket/views/:id"
                element={
                  <RequirePermission perm="VIEW_TICKET">
                    <ViewTicket />
                  </RequirePermission>
                }
              />
              <Route
                path="/checkermaker"
                element={
                  <RequirePermission perm="VIEW_TICKET">
                    <TicketChecker />
                  </RequirePermission>
                }
              />
              <Route
                path="/checkermaker/view/:id"
                element={
                  <RequirePermission perm="VIEW_TICKET">
                    <TicketCheckerView />
                  </RequirePermission>
                }
              />

              <Route
                path="/users"
                element={
                  <RequirePermission perm="VIEW_USER">
                    <Users />
                  </RequirePermission>
                }
              />

              <Route
                path="/users/create"
                element={
                  <RequirePermission perm="CREATE_USER">
                    <UserCreate />
                  </RequirePermission>
                }
              />

              <Route path="/users/:id/view" element={<UsersView />} />

              <Route
                path="/users/:id/edit"
                element={
                  <RequirePermission perm="UPDATE_USER">
                    <UserEdit />
                  </RequirePermission>
                }
              />

              <Route
                path="setting"
                element={
                  <RequirePermission perm="VIEW_SETTING">
                    <Settings />
                  </RequirePermission>
                }
              />

              <Route
                path="settings/roles"
                element={
                  <RequirePermission perm="VIEW_ROLES">
                    <RoleList />
                  </RequirePermission>
                }
              />
              <Route
                path="settings/roles/create"
                element={
                  <RequirePermission perm="CREATE_ROLES">
                    <RoleCreate />
                  </RequirePermission>
                }
              />
              <Route
                path="settings/roles/:id/permissions"
                element={
                  <RequirePermission perm="UPDATE_PERMISSIONS">
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
