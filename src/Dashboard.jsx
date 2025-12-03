import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faFileAlt,
  faChartBar,
  faCar,
  faWrench,
  faDollarSign,
  faUsers,
  faCalendar,
  faChartLine,
  faChartArea,
  faClock,
  faExclamationCircle,
  faBars,
  faSignOutAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const apiService = {
  getDashboardData: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalCustomers: 2847,
          vehiclesRegistered: { total: 3205, cars: 2180, motos: 1025 },
          servicesToday: 28,
          servicesThisMonth: 156,
          revenueToday: 2450,
          revenueThisMonth: 75300,
          pendingInvoices: { count: 12, amount: 8940 },
          servicesTrend: [
            { name: "Mon", services: 12 },
            { name: "Tue", services: 19 },
            { name: "Wed", services: 15 },
            { name: "Thu", services: 22 },
            { name: "Fri", services: 28 },
            { name: "Sat", services: 35 },
            { name: "Sun", services: 18 },
          ],
          topServices: [
            { name: "Oil Change", count: 45 },
            { name: "Tire Replacement", count: 32 },
            { name: "Brake Service", count: 28 },
            { name: "Engine Repair", count: 15 },
            { name: "General Maintenance", count: 38 },
          ],
          customerTypes: [
            { name: "Car Owners", value: 68, color: "#3B82F6" },
            { name: "Moto Owners", value: 32, color: "#10B981" },
          ],
          revenueFlow: [
            { name: "Week 1", revenue: 15000 },
            { name: "Week 2", revenue: 18500 },
            { name: "Week 3", revenue: 22000 },
            { name: "Week 4", revenue: 19800 },
          ],
          recentActivities: [
            {
              type: "booking",
              message: "New service booking - Toyota Camry Oil Change",
              time: "5 min ago",
              icon: faCalendar,
            },
            {
              type: "payment",
              message: "Payment received - $150 from John Smith",
              time: "12 min ago",
              icon: faDollarSign,
            },
            {
              type: "customer",
              message: "New customer added - Maria Garcia",
              time: "25 min ago",
              icon: faUsers,
            },
            {
              type: "followup",
              message: "Follow-up reminder - Honda Civic brake inspection",
              time: "1 hour ago",
              icon: faClock,
            },
          ],
        });
      }, 800);
    });
  },
  getUserProfile: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: "Admin User",
          role: "Administrator",
          branch: "Main Branch",
          lastLogin: "2023-09-12T14:30:00",
        });
      }, 200);
    });
  },
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(5);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await apiService.getDashboardData();
        setDashboardData(data);

        const profile = await apiService.getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      const results = await apiService.search(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    }, 500);

    return () => clearTimeout(debounceTimer);
  });

  const formattedDate = currentDateTime.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const handleNotificationsClick = () => {
    setNotifications(0);
    alert("Notifications feature would open here");
  };
  if (loading || !dashboardData) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 z-20">
        <div className="flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <FontAwesomeIcon
                icon={faBars}
                className="h-5 w-5 text-slate-700"
              />
            </button>

            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  Systen Support
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 relative">
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-slate-100 transition-colors relative"
                onClick={handleNotificationsClick}
              >
                <FontAwesomeIcon
                  icon={faBell}
                  className="h-5 w-5 text-slate-600"
                />
                {notifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full h-4.5 w-4.5 flex items-center justify-center border border-white">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 hover:bg-slate-100 rounded-full px-2.5 py-1.5 transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="bg-blue-100 text-blue-700 rounded-full h-8 w-8 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs font-medium text-slate-800">
                    {userProfile?.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {userProfile?.role}
                  </span>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-1.5 z-40 border border-slate-200">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">
                      {userProfile?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {userProfile?.role}
                    </p>
                  </div>
                  <button className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-colors">
                    Profile
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-colors">
                    Settings
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center">
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="h-4 w-4 mr-2"
                    />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-white/90 backdrop-blur border-r border-slate-200 transition-all duration-300 flex-shrink-0 ${
            sidebarOpen ? "w-60" : "w-18"
          }`}
        >
          <nav className="p-3 space-y-1 h-full flex flex-col">
            <Link
              to="/dashboard"
              className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                activeView === "dashboard"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setActiveView("dashboard")}
            >
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-lg mr-3 transition-all ${
                  activeView === "dashboard"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                }`}
              >
                <FontAwesomeIcon icon={faChartBar} className="h-4 w-4" />
              </div>
              {sidebarOpen && <span>Dashboard</span>}
            </Link>

            <Link
              to="/tickets"
              className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                activeView === "tickets"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setActiveView("tickets")}
            >
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-lg mr-3 transition-all ${
                  activeView === "tickets"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                }`}
              >
                <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
              </div>
              {sidebarOpen && <span>Tickets</span>}
            </Link>

            <Link
              to="/invoices"
              className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                activeView === "invoices"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setActiveView("invoices")}
            >
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-lg mr-3 transition-all ${
                  activeView === "invoices"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                }`}
              >
                <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4" />
              </div>
              {sidebarOpen && <span>Invoices</span>}
            </Link>

            <Link
              to="/reports"
              className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                activeView === "reports"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setActiveView("reports")}
            >
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-lg mr-3 transition-all ${
                  activeView === "reports"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                }`}
              >
                <FontAwesomeIcon icon={faChartArea} className="h-4 w-4" />
              </div>
              {sidebarOpen && <span>Reports</span>}
            </Link>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col p-5 md:p-6 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
          {/* View selector */}
          {activeView !== "dashboard" && (
            <div className="mb-5 bg-white rounded-2xl shadow-sm p-5 border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 capitalize flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs">
                  {activeView.charAt(0).toUpperCase()}
                </span>
                {activeView}
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                This is the <span className="font-medium">{activeView}</span>{" "}
                view. In a real application, this would show relevant content.
              </p>
            </div>
          )}

          {/* Dashboard content */}
          {activeView === "dashboard" && (
            <>
              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {/* Total Customers */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4.5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                        Total Tickets
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">
                        {dashboardData.totalCustomers.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-emerald-600 flex items-center mt-1.5 rounded-full bg-emerald-50 inline-flex px-2 py-0.5">
                        <FontAwesomeIcon
                          icon={faChartLine}
                          className="h-3 w-3 mr-1"
                        />
                        +12.5% vs last week
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <FontAwesomeIcon
                        icon={faUsers}
                        className="h-5 w-5 text-blue-600"
                      />
                    </div>
                  </div>
                </div>
                {/* Vehicles */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4.5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                        Vehicles Registered
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">
                        {dashboardData.vehiclesRegistered.total.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        {dashboardData.vehiclesRegistered.cars.toLocaleString()}{" "}
                        Cars ·{" "}
                        {dashboardData.vehiclesRegistered.motos.toLocaleString()}{" "}
                        Motos
                      </p>
                    </div>
                    <div className="flex space-x-1.5">
                      <div className="bg-blue-50 p-2.5 rounded-xl">
                        <FontAwesomeIcon
                          icon={faCar}
                          className="h-4 w-4 text-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Today */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4.5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                        Services Today
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">
                        {dashboardData.servicesToday}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        {dashboardData.servicesThisMonth} this month
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-xl">
                      <FontAwesomeIcon
                        icon={faWrench}
                        className="h-5 w-5 text-purple-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Revenue Today */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4.5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                        Revenue Today
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">
                        ${dashboardData.revenueToday.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        ${dashboardData.revenueThisMonth.toLocaleString()} this
                        month
                      </p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl">
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className="h-5 w-5 text-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Pending Ticket */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4.5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                        Pending Ticket
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">
                        {dashboardData.pendingInvoices.count}
                      </p>
                      <p className="text-[11px] text-amber-600 mt-1.5 bg-amber-50 inline-flex px-2 py-0.5 rounded-full">
                        ${dashboardData.pendingInvoices.amount.toLocaleString()}{" "}
                        Outstanding
                      </p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-xl">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="h-5 w-5 text-amber-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
