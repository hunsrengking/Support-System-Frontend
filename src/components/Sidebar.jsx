import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faUsers,
  faChartArea,
  faTicket,
  faCheckToSlot,
  faSliders,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../utils/permission";

const Sidebar = ({ sidebarOpen }) => {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <aside
      className={`bg-white/90 backdrop-blur border-r border-slate-200 transition-all duration-300 ${
        sidebarOpen ? "w-60" : "w-18"
      }`}
    >
      <nav className="p-3 space-y-2">
        {/* Dashboard */}
        {hasPermission("VIEW_DASHBOARD") && (
          <Link
            to="/dashboard"
            className="flex items-center p-2 rounded-lg hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faChartBar} className="mr-3" />
            {sidebarOpen && "Dashboard"}
          </Link>
        )}

        {/* Tickets */}
        {hasPermission("VIEW_TICKET") && (
          <Link
            to="/ticket"
            className="flex items-center p-2 rounded-lg hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faTicket} className="mr-3" />
            {sidebarOpen && "Tickets"}
          </Link>
        )}

        {/* Checker */}
        {hasPermission("MAKER_CHECKER") && (
          <Link
            to="/checkermaker"
            className="flex items-center p-2 rounded-lg hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faCheckToSlot} className="mr-3" />
            {sidebarOpen && "CheckerBox"}
          </Link>
        )}

        {/* Users */}
        {hasPermission("VIEW_USER") && (
          <Link
            to="/users"
            className="flex items-center p-2 rounded-lg hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faUsers} className="mr-3" />
            {sidebarOpen && "Users"}
          </Link>
        )}

        {/* ===== REPORTS DROPDOWN ===== */}
        {hasPermission("VIEW_REPORTS") && (
          <div>
            <button
              type="button"
              onClick={() => setReportOpen(!reportOpen)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100"
            >
              <div className="flex items-center">
                <FontAwesomeIcon icon={faChartArea} className="mr-3" />
                {sidebarOpen && "Reports"}
              </div>

              {sidebarOpen && (
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`transition-transform ${
                    reportOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Sub menu */}
            {reportOpen && sidebarOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/reports/summary"
                  className="block px-2 py-1 rounded hover:bg-slate-100 text-sm"
                >
                  Ticket
                </Link>
              </div>
            )}
          </div>
        )}
        {/* Settings */}
        {hasPermission("VIEW_SETTING") && (
          <Link
            to="/setting"
            className="flex items-center p-2 rounded-lg hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faSliders} className="mr-3" />
            {sidebarOpen && "Setting"}
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
