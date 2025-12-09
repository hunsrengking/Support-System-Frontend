// src/views/tickets/ViewTicket.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faSave,
  faTimes,
  faTicketAlt,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/formatdate";

const STATUS_OPTIONS = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
  { value: "Closed", label: "Closed" },
];

const ViewTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    status_name: "",
    start_date: "",
    end_date: "",
  });
  const [saving, setSaving] = useState(false);

  const loadTicket = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get(`/api/ticket/${id}`);
      const data = res?.data ?? res;
      if (!data) {
        setTicket(null);
        setError("Ticket not found.");
        return;
      }
      setTicket(data);
      // Initialize form values from response (convert to input-friendly values)
      setForm({
        status_name: data.status_name ?? data.status ?? "",
        start_date: toDateTimeLocal(
          data.start_date ?? data.startDate ?? data.start_date
        ),
        end_date: toDateTimeLocal(
          data.end_date ?? data.endDate ?? data.end_date
        ),
      });
    } catch (err) {
      console.error("Error loading ticket:", err);
      if (err?.response?.status === 404) {
        setTicket(null);
        setError("Ticket not found.");
      } else {
        setError("Failed to load ticket. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const handleBack = () => navigate("/ticket");
  const startEdit = () => {
    // enter edit mode and initialize form from current ticket state
    setForm({
      status_name: ticket?.status_name ?? ticket?.status ?? "",
      start_date: toDateTimeLocal(
        ticket?.start_date ?? ticket?.startDate ?? ticket?.start_date
      ),
      end_date: toDateTimeLocal(
        ticket?.end_date ?? ticket?.endDate ?? ticket?.end_date
      ),
    });
    setEditing(true);
  };
  const cancelEdit = () => {
    setEditing(false);
    // discard changes; reset form (optional)
    setForm({
      status_name: ticket?.status_name ?? ticket?.status ?? "",
      start_date: toDateTimeLocal(
        ticket?.start_date ?? ticket?.startDate ?? ticket?.start_date
      ),
      end_date: toDateTimeLocal(
        ticket?.end_date ?? ticket?.endDate ?? ticket?.end_date
      ),
    });
  };

  const toDateTimeLocal = (iso) => {
    if (!iso) return "";
    try {
      // Normalize possible seconds/milliseconds
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      // get local components and format yyyy-MM-ddTHH:mm (datetime-local)
      const pad = (n) => n.toString().padStart(2, "0");
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const min = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    } catch {
      return "";
    }
  };

  const fromDateTimeLocalToISO = (localValue) => {
    if (!localValue) return null;
    // localValue looks like "YYYY-MM-DDTHH:mm"
    const d = new Date(localValue);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSave = async () => {
    // Only send fields allowed to update
    const payload = {
      status_id: mapStatusToId(form.status_name, ticket), // attempt to send ID if backend expects it, fallback to name
      status_name: form.status_name, // include name in case backend accepts it
      start_date: fromDateTimeLocalToISO(form.start_date),
      end_date: fromDateTimeLocalToISO(form.end_date),
    };

    // Remove null fields (if backend doesn't like nulls)
    Object.keys(payload).forEach((k) => {
      if (payload[k] === null || payload[k] === undefined) delete payload[k];
    });

    try {
      setSaving(true);
      // Use PATCH so we only update provided fields
      await axiosClient.patch(`/api/ticket/${id}`, payload);
      // reload ticket to refresh UI
      await loadTicket();
      setEditing(false);
    } catch (err) {
      console.error("Error saving ticket:", err);
      const msg =
        err?.response?.data?.detail ??
        "Failed to save changes. Please try again.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };
  const mapStatusToId = (statusName, ticketData) => {
    if (!statusName) return undefined;
    // Attempt to use ticketData.status_id if the name matches current one
    if (
      ticketData &&
      (ticketData.status_name === statusName ||
        ticketData.status === statusName)
    ) {
      return ticketData.status_id ?? ticketData.statusId ?? undefined;
    }
    switch (statusName.toLowerCase()) {
      case "open":
        return 1;
      case "in progress":
        return 2;
      case "resolved":
        return 3;
      case "closed":
        return 4;
      default:
        return undefined;
    }
  };

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
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl
                         border border-slate-200 text-slate-500 hover:bg-slate-50"
              aria-label="Back to list"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            </button>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Ticket Detail
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                View information for ticket #{id}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!editing ? (
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                           rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700"
              >
                <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
                >
                  <FontAwesomeIcon icon={faSave} className="h-4 w-4" />
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={cancelEdit}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-60"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {loading ? (
          <p className="text-sm text-slate-400">Loading ticket...</p>
        ) : error ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
            <button
              onClick={loadTicket}
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              Retry
            </button>
          </div>
        ) : !ticket ? (
          <p className="text-sm text-slate-400">Ticket not found.</p>
        ) : (
          <div className="space-y-6">
            {/* Top row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faTicketAlt}
                    className="h-5 w-5 text-blue-600"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {ticket.title ?? `Ticket #${ticket.id}`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Ticket ID: {ticket.id}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Status - shows badge when not editing, or select when editing */}
                {!editing ? (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClasses(
                      ticket.status_name ?? ticket.status
                    )}`}
                  >
                    {ticket.status_name ?? ticket.status ?? "Unknown"}
                  </span>
                ) : (
                  <select
                    name="status_name"
                    value={form.status_name}
                    onChange={handleChange}
                    className="rounded-lg px-3 py-2 border border-slate-200 text-sm"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                )}

                {/* Priority (read-only always) */}
                {(ticket.priority_name || ticket.priority_id) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                    Priority: {ticket.priority_name ?? ticket.priority_id}
                  </span>
                )}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">
                    Category
                  </p>
                  <p className="text-slate-800">
                    {ticket.category_name ?? ticket.category ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">
                    Created By
                  </p>
                  <p className="text-slate-800">{ticket.created_by ?? "-"}</p>
                </div>

                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">
                    Created At
                  </p>
                  <p className="text-slate-800">
                    {formatDate(ticket.create_date)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">
                    Assigned To
                  </p>
                  <p className="text-slate-800">{ticket.assigned_to ?? "-"}</p>
                </div>

                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">
                    Updated At
                  </p>
                  <p className="text-slate-800">
                    {formatDate(ticket.update_date ?? ticket.updated_at)}
                  </p>
                </div>

                {/* Start / End Date (editable only when editing) */}
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">
                    Start Date
                  </p>
                  {!editing ? (
                    <p className="text-slate-800">
                      {formatDate(
                        ticket.start_date ??
                          ticket.startDate ??
                          ticket.start_date
                      )}
                    </p>
                  ) : (
                    <input
                      type="datetime-local"
                      name="start_date"
                      value={form.start_date}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  )}
                </div>

                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">
                    End Date
                  </p>
                  {!editing ? (
                    <p className="text-slate-800">
                      {formatDate(
                        ticket.end_date ?? ticket.endDate ?? ticket.end_date
                      )}
                    </p>
                  ) : (
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={form.end_date}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Items (if any) */}
            {Array.isArray(ticket.items) && ticket.items.length > 0 && (
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">
                  Attachments
                </p>
                <div className="space-y-2">
                  {ticket.items.map((it) => (
                    <div
                      key={
                        it.id ?? `${it.image_path ?? ""}-${it.file_path ?? ""}`
                      }
                      className="flex items-start gap-3"
                    >
                      {it.image_path ? (
                        <img
                          src={it.image_path}
                          alt={it.description ?? "attachment"}
                          className="w-20 h-14 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-20 h-14 flex items-center justify-center rounded-md border text-xs text-slate-400">
                          No image
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-slate-800">
                          {it.description ?? "Attachment"}
                        </p>
                        {it.file_path && (
                          <a
                            href={it.file_path}
                            className="text-xs text-blue-600 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open file
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Description */}
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
            Description
          </p>
          <div
            type="Text"
            className="text-sm text-slate-800 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3"
          >
            {ticket.description || "No description provided."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;
