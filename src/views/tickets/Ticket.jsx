// src/views/settings/users/Users.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faTicket } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/formatdate";

const Ticket = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/ticket");
      const data = res?.data ?? res;
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading tickets:", err);
      setError("Failed to load tickets. Please try again.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleAddTicket = () => navigate("/ticket/create");
  const handleViewTicket = (id) => navigate(`/ticket/views/${id}`);

  const statusBadgeClasses = (status) => {
    switch ((status || "").toLowerCase()) {
      case "open":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "in progress":
        return "bg-blue-50 text-blue-700 border border-blue-100";
      case "resolved":
        return "bg-violet-50 text-violet-700 border border-violet-100";
      case "closed":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  const statusDotClasses = (status) => {
    switch ((status || "").toLowerCase()) {
      case "open":
        return "bg-emerald-500";
      case "in progress":
        return "bg-blue-500";
      case "resolved":
        return "bg-violet-500";
      case "closed":
        return "bg-slate-500";
      default:
        return "bg-slate-400";
    }
  };

  const q = searchTerm.trim().toLowerCase();
  const filteredTickets = tickets.filter((t) => {
    if (!q) return true;
    return (
      (t.title ?? "").toLowerCase().includes(q) ||
      (t.status_name ?? "").toLowerCase().includes(q) ||
      (t.priority_name ?? "").toLowerCase().includes(q) ||
      (t.category_name ?? "").toLowerCase().includes(q) ||
      (t.assigned_to_name ?? "").toLowerCase().includes(q)
    );
  });
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
              <FontAwesomeIcon icon={faTicket} />
              Ticket
            </h1>
            <p className="text-sm text-slate-500">Ticket Management</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl
                  focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                  placeholder:text-slate-400 outline-none"
              />
            </div>

            <button
              onClick={handleAddTicket}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm
                font-medium rounded-xl bg-blue-600 text-white shadow-sm
                hover:bg-blue-700 focus:outline-none focus:ring-2
                focus:ring-blue-500/50"
            >
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              Add Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    Loading tickets...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-red-500"
                  >
                    {error}
                    <button
                      onClick={loadTickets}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => handleViewTicket(t.id)}
                    className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {t.id}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {t.title ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {t.category ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {t.priority ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBadgeClasses(
                          t.status
                        )}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusDotClasses(
                            t.status
                          )}`}
                        />
                        {t.status ?? "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {t.assigned_to ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(t.create_date)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(t.start_date)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(t.end_date)}
                    </td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {searchTerm
                      ? "No tickets match your search."
                      : "No tickets found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center">
          <span>
            Showing {filteredTickets.length} of {tickets.length} tickets
          </span>
          <span className="text-slate-400">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
