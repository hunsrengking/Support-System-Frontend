// src/views/settings/users/TicketChecker.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTrash,
  faCheck,
  faXmark,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";

const TicketChecker = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/tickets");
      setTickets(res.data || []);
    } catch (err) {
      console.error("Error loading tickets:", err);
      setError("Failed to load tickets. Please try again.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleViewTicket = (id) => {
    navigate(`/tickets/${id}`);
  };

  const statusBadgeClasses = (status) => {
    switch (status) {
      case "Open":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border border-blue-100";
      case "Resolved":
        return "bg-violet-50 text-violet-700 border border-violet-100";
      case "Closed":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      case "Waiting Approval":
        return "bg-amber-50 text-amber-700 border border-amber-100";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  const statusDotClasses = (status) => {
    switch (status) {
      case "Open":
        return "bg-emerald-500";
      case "In Progress":
        return "bg-blue-500";
      case "Resolved":
        return "bg-violet-500";
      case "Closed":
        return "bg-slate-500";
      case "Waiting Approval":
        return "bg-amber-500";
      default:
        return "bg-slate-400";
    }
  };

  // 🔍 filter by "Waiting Approval" + search
  const waitingTickets = tickets.filter(
    (t) => t.status === "Waiting Approval" // 👉 change this string if your status is different
  );

  const filteredTickets = waitingTickets.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      t.subject?.toLowerCase().includes(q) ||
      t.status?.toLowerCase().includes(q) ||
      t.priority?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q) ||
      t.assigned_to?.toLowerCase().includes(q) ||
      t.created_by?.toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allSelected =
    filteredTickets.length > 0 &&
    filteredTickets.every((t) => selectedIds.includes(t.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filteredTickets.some((t) => t.id === id))
      );
    } else {
      const idsToAdd = filteredTickets
        .map((t) => t.id)
        .filter((id) => !selectedIds.includes(id));
      setSelectedIds((prev) => [...prev, ...idsToAdd]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete selected tickets?")) {
      return;
    }

    try {
      setActionLoading(true);
      await Promise.all(
        selectedIds.map((id) => axiosClient.delete(`/api/tickets/${id}`))
      );
      setTickets((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error("Error deleting tickets:", err);
      alert("Failed to delete some tickets.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedIds.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    const label = newStatus === "Approved" ? "approve" : "reject";
    if (
      !window.confirm(
        `Are you sure you want to ${label} selected tickets to "${newStatus}"?`
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await Promise.all(
        selectedIds.map((id) =>
          axiosClient.patch(`/api/tickets/${id}`, { status: newStatus })
        )
      );

      setTickets((prev) =>
        prev.map((t) =>
          selectedIds.includes(t.id) ? { ...t, status: newStatus } : t
        )
      );
      setSelectedIds([]);
    } catch (err) {
      console.error(`Error updating tickets to ${newStatus}:`, err);
      alert(`Failed to ${label} some tickets.`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
              <FontAwesomeIcon icon={faTicket} />
              Ticket Checker
            </h1>
            <p className="text-sm text-slate-500">
              Tickets waiting for approval
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Selected: {selectedIds.length}
            </p>
          </div>

          {/* Search + bulk buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="filter ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl
                           focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                           placeholder:text-slate-400 outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkStatusChange("Approved")}
                disabled={actionLoading || selectedIds.length === 0}
                className={`inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm
                            font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2
                            focus:ring-emerald-500/50
                            ${
                              selectedIds.length === 0 || actionLoading
                                ? "bg-emerald-200 text-emerald-800 cursor-not-allowed"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
              >
                <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                Approve
              </button>
              <button
                onClick={() => handleBulkStatusChange("Rejected")}
                disabled={actionLoading || selectedIds.length === 0}
                className={`inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm
                            font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2
                            focus:ring-amber-500/50
                            ${
                              selectedIds.length === 0 || actionLoading
                                ? "bg-amber-200 text-amber-800 cursor-not-allowed"
                                : "bg-amber-500 text-white hover:bg-amber-600"
                            }`}
              >
                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={actionLoading || selectedIds.length === 0}
                className={`inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm
                            font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2
                            focus:ring-red-500/50
                            ${
                              selectedIds.length === 0 || actionLoading
                                ? "bg-red-200 text-red-800 cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
              >
                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Create By</th>
                <th className="px-4 py-3">Created At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    Loading tickets...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={8}
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
                filteredTickets.map((t) => {
                  const checked = selectedIds.includes(t.id);
                  return (
                    <tr
                      key={t.id}
                      onClick={() => handleViewTicket(t.id)}
                      className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                    >
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSelect(t.id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {t.id}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {t.subject || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {t.category || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {t.priority || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                          ${statusBadgeClasses(t.status)}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusDotClasses(
                              t.status
                            )}`}
                          />
                          {t.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {t.assigned_to || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {t.created_at || "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {searchTerm
                      ? "No tickets match your search."
                      : "No tickets waiting for approval."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center">
          <span>
            Showing {filteredTickets.length} of {waitingTickets.length} tickets
            waiting approval
          </span>
          <span className="text-slate-400">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};

export default TicketChecker;
