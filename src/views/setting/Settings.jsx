// src/views/settings/Settings.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faUsersCog,
  faBuilding,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <FontAwesomeIcon icon={faCogs} />
          Setting System
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage roles, permissions, departments, and Telegram configuration.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Roles & Permission Card */}
        <Link
          to="/settings/roles"
          className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm 
                     hover:shadow-md hover:border-blue-400 hover:-translate-y-1 
                     transition-all duration-200 block"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faUsersCog}
                className="text-blue-600 w-5 h-5"
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600">
                Manage Roles & Permission
              </h2>
              <p className="text-xs text-slate-500">
                Create and manage user roles.
              </p>
            </div>
          </div>
        </Link>

        {/* Department Card */}
        <Link
          to="/settings/departments"
          className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm 
                     hover:shadow-md hover:border-blue-400 hover:-translate-y-1 
                     transition-all duration-200 block"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faBuilding}
                className="text-blue-600 w-5 h-5"
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600">
                Departments
              </h2>
              <p className="text-xs text-slate-500">
                Manage support departments.
              </p>
            </div>
          </div>
        </Link>

        {/* Telegram Card */}
        <Link
          to="/settings/telegram"
          className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm 
                     hover:shadow-md hover:border-blue-400 hover:-translate-y-1 
                     transition-all duration-200 block"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="text-blue-600 w-5 h-5"
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600">
                Telegram
              </h2>
              <p className="text-xs text-slate-500">
                Telegram integration configuration.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Settings;
