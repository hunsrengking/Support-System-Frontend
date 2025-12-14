import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheck,
  faXmark,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../../utils/formatdate";
import { hasPermission } from "../../../utils/permission";

const TicketChecker = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true); // KEEP
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/ticket/status/waitingapprove");
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
    navigate(`/checkermaker/view/${id}`);
  };

  const statusBadgeClasses = (status) => {
    switch (status) {
      case "Waiting Approval":
        return "bg-amber-50 text-amber-700 border border-amber-100";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  const statusDotClasses = (status) => {
    switch (status) {
      case "Waiting Approval":
        return "bg-amber-500";
      default:
        return "bg-slate-400";
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      t.subject?.toLowerCase().includes(q) ||
      t.status?.toLowerCase().includes(q) ||
      t.priority?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q) ||
      t.assigned_to?.toLowerCase().includes(q) ||
      t.created_by?.toLowerCase().includes(q) ||
      t.title?.toLowerCase().includes(q)
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

  // --- BULK DELETE ---
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

      const calls = selectedIds.map((id) =>
        axiosClient.delete(`/api/ticket/${id}`)
      );

      await Promise.allSettled(calls);
      await loadTickets();
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      alert("Delete error.");
    } finally {
      setActionLoading(false);
    }
  };

  // --- BULK APPROVE / REJECT ---
  const handleBulkStatusChange = async (newStatus) => {
    if (selectedIds.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    const isApprove = newStatus === "Approved";
    const label = isApprove ? "approve" : "reject";

    if (
      !window.confirm(`Are you sure you want to ${label} selected tickets?`)
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const calls = selectedIds.map((id) =>
        isApprove
          ? axiosClient.patch(`/api/ticket/${id}/approve`, null)
          : axiosClient.patch(`/api/ticket/${id}/reject`, null)
      );

      await Promise.allSettled(calls);
      await loadTickets();
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="filter ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 pl-3 pr-3 py-2 text-sm border border-slate-200 rounded-xl
                focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none"
            />

            <div className="flex flex-wrap gap-2">
              {hasPermission("APPROVE_CHEKER") && (
                <button
                  onClick={() => handleBulkStatusChange("Approved")}
                  disabled={actionLoading || selectedIds.length === 0}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm
                  font-medium rounded-xl shadow-sm
                  ${
                    selectedIds.length === 0 || actionLoading
                      ? "bg-emerald-200 text-emerald-800 cursor-not-allowed"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                  Approve
                </button>
              )}

              {hasPermission("REJECT_CHEKER") && (
                <button
                  onClick={() => handleBulkStatusChange("Rejected")}
                  disabled={actionLoading || selectedIds.length === 0}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm
                  font-medium rounded-xl shadow-sm
                  ${
                    selectedIds.length === 0 || actionLoading
                      ? "bg-amber-200 text-amber-800 cursor-not-allowed"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
                >
                  <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                  Reject
                </button>
              )}

              {hasPermission("DELETE_CHEKER") && (
                <button
                  onClick={handleBulkDelete}
                  disabled={actionLoading || selectedIds.length === 0}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm
                  font-medium rounded-xl shadow-sm
                  ${
                    selectedIds.length === 0 || actionLoading
                      ? "bg-red-200 text-red-800 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                  Delete
                </button>
              )}
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
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Create By</th>
                <th className="px-4 py-3">Created At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {error ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => handleViewTicket(t.id)}
                    className="hover:bg-slate-50 cursor-pointer"
                  >
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(t.id)}
                        onChange={() => toggleSelect(t.id)}
                      />
                    </td>
                    <td className="px-4 py-3">{t.id}</td>
                    <td className="px-4 py-3">{t.title || t.subject || "-"}</td>
                    <td className="px-4 py-3">{t.category || "-"}</td>
                    <td className="px-4 py-3">{t.priority || "-"}</td>
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
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{t.created_by || "-"}</td>
                    <td className="px-4 py-3">
                      {formatDate(t.created_at || "-")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    No tickets waiting for approval.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TicketChecker;
