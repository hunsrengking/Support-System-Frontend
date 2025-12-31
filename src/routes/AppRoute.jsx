import React, { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Layout from "../layouts/Layout";
import { AuthProvider } from "../auth/auth";

import ProtectedRoute from "./ProtectedRoute";
import RequirePermission from "./RequirePermission";

import Loading from "../components/common/Loanding";
import GlobalLoading from "../components/common/GlobalLoading";
import { useLoading } from "../context/LoadingContext";

import CreateTicket from "../views/tickets/CreateTicket";
import TicketChecker from "../views/setting/checker/Checker";
import TicketCheckerView from "../views/setting/checker/CheckerView";
import DepartmentList from "../views/setting/department/Department";
import DepartmentCreate from "../views/setting/department/CreateDepartment";
import Telegram from "../views/setting/configuration/Telegram";
import DepartmentMember from "../views/setting/department/DepartmentMember";
import Report from "../views/report/Report";
import Position from "../views/setting/positions/Positions";
import Staff from "../views/setting/staff/Staff";
import StaffCreate from "../views/setting/staff/StaffCreate";
import StaffEdit from "../views/setting/staff/StaffEdit";
import ViewStaff from "../views/setting/staff/ViewStaff";

/* ---------- Lazy-loaded pages ---------- */
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

/* ---------- Global loading helper (NO permission logic here) ---------- */
const GlobalLoaderFix = ({ children }) => {
  const { loading } = useLoading();
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && loading && <GlobalLoading />}
      {children}
    </>
  );
};

const AppRoute = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalLoaderFix>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* -------- Public -------- */}
              <Route path="/login" element={<Login />} />
              <Route path="/403" element={<NoPermission />} />

              {/* -------- Protected -------- */}
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
                    <RequirePermission perm="CREATE_TICKET">
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
                    <RequirePermission perm="MAKER_CHECKER">
                      <TicketChecker />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/checkermaker/view/:id"
                  element={
                    <RequirePermission perm="MAKER_CHECKER">
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

                <Route
                  path="/users/:id/view"
                  element={
                    <RequirePermission perm="VIEW_USER">
                      <UsersView />
                    </RequirePermission>
                  }
                />

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

                <Route
                  path="/settings/departments"
                  element={
                    <RequirePermission perm="VIEW_DEPARTMENT">
                      <DepartmentList />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/settings/department/create"
                  element={
                    <RequirePermission perm="CREATE_DEPARTMENT">
                      <DepartmentCreate />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/settings/department/:id/members"
                  element={
                    <RequirePermission perm="VIEW_DEPARTMENT">
                      <DepartmentMember />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/settings/telegram"
                  element={
                    <RequirePermission perm="UPDATE_PERMISSIONS">
                      <Telegram />
                    </RequirePermission>
                  }
                />
                <Route
                  path="settings/positions"
                  element={
                    <RequirePermission perm="UPDATE_PERMISSIONS">
                      <Position />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/reports/summary"
                  element={
                    <RequirePermission perm="VIEW_REPORTS">
                      <Report />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/settings/employees"
                  element={
                    <RequirePermission perm="VIEW_SETTING">
                      <Staff />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/settings/employees/create"
                  element={
                    <RequirePermission perm="VIEW_SETTING">
                      <StaffCreate />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/settings/employees/:id/edit"
                  element={
                    <RequirePermission perm="VIEW_SETTING">
                      <StaffEdit />
                    </RequirePermission>
                  }
                />
                <Route
                  path="/settings/employees/:id/view"
                  element={
                    <RequirePermission perm="VIEW_SETTING">
                      <ViewStaff />
                    </RequirePermission>
                  }
                />
                <Route path="*" element={<div>404 Not Found</div>} />
              </Route>
            </Routes>
          </Suspense>
        </GlobalLoaderFix>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoute;
