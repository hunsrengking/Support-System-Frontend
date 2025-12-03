import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faCogs,
  faUsers,
  faFileAlt,
  faChartArea,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ sidebarOpen }) => {
  return (
    <aside
      className={`bg-white/90 backdrop-blur border-r border-slate-200 transition-all duration-300 ${
        sidebarOpen ? "w-60" : "w-18"
      }`}
    >
      <nav className="p-3 space-y-2">
        <Link
          to="/dashboard"
          
          className="flex items-center p-2 rounded-lg hover:bg-slate-100"
        >
          <FontAwesomeIcon icon={faChartBar} className="mr-3" />
          {sidebarOpen && "Dashboard"}
        </Link>
        <Link
          to="/ticket"
          className="flex items-center p-2 rounded-lg hover:bg-slate-100"
        >
          <FontAwesomeIcon icon={faFileAlt} className="mr-3" />
          {sidebarOpen && "Tickets"}
        </Link>
        <Link
          to="/setting"
          className="flex items-center p-2 rounded-lg hover:bg-slate-100"
        >
          <FontAwesomeIcon icon={faCogs} className="mr-3" />
          {sidebarOpen && "Setting"}
        </Link>
        <Link
          to="/users"
          className="flex items-center p-2 rounded-lg hover:bg-slate-100"
        >
          <FontAwesomeIcon icon={faUsers} className="mr-3" />
          {sidebarOpen && "Users"}
        </Link>

        <Link
          to="/reports"
          className="flex items-center p-2 rounded-lg hover:bg-slate-100"
        >
          <FontAwesomeIcon icon={faChartArea} className="mr-3" />
          {sidebarOpen && "Reports"}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
