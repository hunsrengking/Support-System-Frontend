// src/views/errors/NoPermission.jsx
import React from "react";
import { Link } from "react-router-dom";

const NoPermission = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2">403 – Forbidden</h1>
        <p className="text-slate-600 mb-4">You do not have permission to access this page.</p>
        <Link to="/" className="px-4 py-2 bg-slate-800 text-white rounded">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NoPermission;
