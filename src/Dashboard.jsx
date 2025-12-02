import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Import Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBell,
  faUser,
  faFileAlt,
  faChartBar,
  faCar,
  faMotorcycle,
  faWrench,
  faDollarSign,
  faUsers,
  faCalendar,
  faChartLine,
  faChartArea,
  faClock,
  faExclamationCircle,
  faEye,
  faBars,
  faSignOutAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

// Mock API service functions
const apiService = {
  // Simulate API calls with delays
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
      }, 800); // Simulate network delay
    });
  },

  search: (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock search results
        const results = [
          { type: "customer", name: "John Smith", detail: "3 vehicles" },
          { type: "service", name: "Oil Change", detail: "$49.99" },
          { type: "invoice", name: "INV-00345", detail: "Pending - $120" },
        ].filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.detail.toLowerCase().includes(query.toLowerCase())
        );

        resolve(results);
      }, 300);
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
  // State management
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
  const [timeRange, setTimeRange] = useState("week"); // For chart filtering

  // Load dashboard data on component mount
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

    // Set up live date/time
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle search with debouncing
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
  }, [searchQuery]);

  // Format date and time
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

  // Handle notification click
  const handleNotificationsClick = () => {
    setNotifications(0); // Mark as read
    // In a real app, you would navigate to notifications page
    alert("Notifications feature would open here");
  };

  // Handle time range change for charts
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  // Loading state
  if (loading || !dashboardData) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FontAwesomeIcon
                icon={faBars}
                className="h-5 w-5 text-gray-700"
              />
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FontAwesomeIcon
                  icon={faWrench}
                  className="h-6 w-6 text-white"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">WBMS-CMS</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4 relative">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
              />
              <input
                type="text"
                placeholder="Search customers, services, invoices..."
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
              />

              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                </button>
              )}

              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-10 border border-gray-200 overflow-hidden">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-900">
                        {result.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.detail}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                onClick={handleNotificationsClick}
              >
                <FontAwesomeIcon
                  icon={faBell}
                  className="h-5 w-5 text-gray-600"
                />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <button
                className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="bg-blue-100 text-blue-700 rounded-full h-8 w-8 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {userProfile?.name}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {userProfile?.name}
                    </p>
                    <p className="text-xs text-gray-500">{userProfile?.role}</p>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center"
                  >
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="h-4 w-4 mr-2"
                    />
                    Sign out
                  </a>
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
          className={`bg-white shadow-sm transform transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0"
          } overflow-hidden flex-shrink-0`}
        >
          <nav className="p-4 space-y-1">
            <a
              href="#"
              className={`flex items-center space-x-3 rounded-lg px-3 py-3 ${
                activeView === "dashboard"
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
              } transition-all`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView("dashboard");
              }}
            >
              <FontAwesomeIcon icon={faChartBar} className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </a>
            <a
              href="#"
              className={`flex items-center space-x-3 rounded-lg px-3 py-3 ${
                activeView === "customers"
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
              } transition-all`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView("customers");
              }}
            >
              <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
              <span>Customers</span>
            </a>
            <a
              href="#"
              className={`flex items-center space-x-3 rounded-lg px-3 py-3 ${
                activeView === "vehicles"
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
              } transition-all`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView("vehicles");
              }}
            >
              <FontAwesomeIcon icon={faCar} className="h-5 w-5" />
              <span>Vehicles</span>
            </a>
            <a
              href="#"
              className={`flex items-center space-x-3 rounded-lg px-3 py-3 ${
                activeView === "services"
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
              } transition-all`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView("services");
              }}
            >
              <FontAwesomeIcon icon={faWrench} className="h-5 w-5" />
              <span>Services</span>
            </a>
            <a
              href="#"
              className={`flex items-center space-x-3 rounded-lg px-3 py-3 ${
                activeView === "invoices"
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
              } transition-all`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView("invoices");
              }}
            >
              <FontAwesomeIcon icon={faFileAlt} className="h-5 w-5" />
              <span>Invoices</span>
            </a>
            <a
              href="#"
              className={`flex items-center space-x-3 rounded-lg px-3 py-3 ${
                activeView === "reports"
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
              } transition-all`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView("reports");
              }}
            >
              <FontAwesomeIcon icon={faChartArea} className="h-5 w-5" />
              <span>Reports</span>
            </a>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto bg-gradient-to-br from-blue-50/30 to-indigo-50/30">
          {/* View selector - only show when not on dashboard */}
          {activeView !== "dashboard" && (
            <div className="mb-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {activeView}
              </h2>
              <p className="text-gray-600">
                This is the {activeView} view. In a real application, this would
                show relevant content.
              </p>
            </div>
          )}

          {/* Dashboard content */}
          {activeView === "dashboard" && (
            <>
              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Customers
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {dashboardData.totalCustomers.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <FontAwesomeIcon
                          icon={faChartLine}
                          className="h-3 w-3 mr-1"
                        />{" "}
                        +12.5%
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FontAwesomeIcon
                        icon={faUsers}
                        className="h-5 w-5 text-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Vehicles Registered
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {dashboardData.vehiclesRegistered.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {dashboardData.vehiclesRegistered.cars.toLocaleString()}{" "}
                        Cars |{" "}
                        {dashboardData.vehiclesRegistered.motos.toLocaleString()}{" "}
                        Motos
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FontAwesomeIcon
                          icon={faCar}
                          className="h-4 w-4 text-blue-600"
                        />
                      </div>
                      <div className="bg-green-100 p-2 rounded-lg">
                        <FontAwesomeIcon
                          icon={faMotorcycle}
                          className="h-4 w-4 text-green-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Services Today
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {dashboardData.servicesToday}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {dashboardData.servicesThisMonth} This Month
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <FontAwesomeIcon
                        icon={faWrench}
                        className="h-5 w-5 text-purple-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Revenue Today
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${dashboardData.revenueToday.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ${dashboardData.revenueThisMonth.toLocaleString()} This
                        Month
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className="h-5 w-5 text-green-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Pending Invoices
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {dashboardData.pendingInvoices.count}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        ${dashboardData.pendingInvoices.amount.toLocaleString()}{" "}
                        Outstanding
                      </p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="h-5 w-5 text-orange-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Service Trends (This Week)
                    </h3>
                    <select
                      className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={timeRange}
                      onChange={(e) => handleTimeRangeChange(e.target.value)}
                    >
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                    </select>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={dashboardData.servicesTrend}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "6px",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="services"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "#2563EB" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Top Services (This Month)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={dashboardData.topServices}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "6px",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Customer Types
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={dashboardData.customerTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {dashboardData.customerTypes.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "6px",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={10}
                        formatter={(value) => (
                          <span className="text-sm text-gray-600">{value}</span>
                        )}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Revenue Flow (This Month)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={dashboardData.revenueFlow}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        formatter={(value) => [
                          `$${value.toLocaleString()}`,
                          "Revenue",
                        ]}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "6px",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Activity
                  </h3>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 transition-colors">
                    <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                    <span>View All</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {dashboardData.recentActivities.map((activity, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div
                          className={`p-2 rounded-full ${
                            activity.type === "booking"
                              ? "bg-blue-100 text-blue-600"
                              : activity.type === "payment"
                              ? "bg-green-100 text-green-600"
                              : activity.type === "customer"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-orange-100 text-orange-600"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={activity.icon}
                            className="h-4 w-4"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">
                            {activity.message}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <footer className="mt-auto p-4 text-center text-gray-600 text-sm space-y-1 rounded-lg ">
            <div>
              Release Version: 23.3.V2.RELEASE.UAT | TUFU Release Date:
              20-March-2023
            </div>
            <div>
              <span className="text-blue-600 font-bold">Branch Name:</span>{" "}
              <span className="font-bold">{userProfile?.branch}</span> |{" "}
              <span className="text-blue-600 font-bold">Status:</span>{" "}
              <span className="font-bold">Branch is opening</span> |{" "}
              <span className="text-blue-600 font-bold">Working Date:</span>{" "}
              <span className="font-bold">
                {formattedDate} {formattedTime}
              </span>
            </div>
            <div>
              <span className="text-blue-600 font-bold">User Login:</span>{" "}
              <span className="font-bold">{userProfile?.name}</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
