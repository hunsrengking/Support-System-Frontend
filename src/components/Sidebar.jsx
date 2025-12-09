import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faUsers,
  faChartArea,
  faTicket,
  faCheckToSlot,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../utils/permission";

const Sidebar = ({ sidebarOpen }) => {
  return (
    <aside
      className={`bg-white/90 backdrop-blur border-r border-slate-200 transition-all duration-300 ${
        sidebarOpen ? "w-60" : "w-18"
      }`}
    >
      <nav className="p-3 space-y-2">
        {hasPermission("view_dashboard") && (
          <Link
            to="/dashboard"
            className="flex items-center p-2 rounded-lg hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faChartBar} className="mr-3" />
            {sidebarOpen && "Dashboard"}
          </Link>
        )}

        {hasPermission("view_ticket") && (
          <Link
            to="/ticket"
            className="flex items-center p-2 rounded-lg hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faTicket} className="mr-3" />
            {sidebarOpen && "Tickets"}
          </Link>
        )}
        {hasPermission("view_ticket") && (
          <Link
            to="/checkermaker"
            className="flex items-center p-2 rounded-lg hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faCheckToSlot} className="mr-3" />
            {sidebarOpen && "CheckerBox"}
          </Link>
        )}
        {hasPermission("view_setting") && (
          <Link
            to="/setting"
            className="flex items-center p-2 rounded-lg hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faSliders} className="mr-3" />
            {sidebarOpen && "Setting"}
          </Link>
        )}

        {hasPermission("view_users") && (
          <Link
            to="/users"
            className="flex items-center p-2 rounded-lg hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faUsers} className="mr-3" />
            {sidebarOpen && "Users"}
          </Link>
        )}

        {hasPermission("view_reports") && (
          <Link
            to="/reports"
            className="flex items-center p-2 rounded-lg hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faChartArea} className="mr-3" />
            {sidebarOpen && "Reports"}
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
