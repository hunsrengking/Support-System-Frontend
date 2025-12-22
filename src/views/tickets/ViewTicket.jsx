/* eslint-disable no-unused-vars */
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
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/formatdate";
import { Download } from "lucide-react";
import { useError } from "../../context/ErrorContext";

const ViewTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  // ticket + ui state
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess } = useError();
  // editing form
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    status_name: "",
    start_date: "",
    end_date: "",
    assigned_to: "",
    priority_id: "",
    category_id: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [priorities, setPriorities] = useState([]);
  const [loadingPriority, setLoadingPriority] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const canAssign = true;

  const isoToDatetimeLocalValue = (iso) => {
    if (!iso) return "";
    try {
      return iso.slice(0, 16);
    } catch {
      return "";
    }
  };
  const loadDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const res = await axiosClient.get("/api/department");
      setDepartments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading departments:", err);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };
  const loadCategory = async () => {
    setLoadingCategory(true);
    try {
      const res = await axiosClient.get("/api/category");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    } finally {
      setLoadingCategory(false);
    }
  };
  const loadPriority = async () => {
    setLoadingPriority(true);
    try {
      const res = await axiosClient.get("/api/priority");
      setPriorities(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading priorities:", err);
      setPriorities([]);
    } finally {
      setLoadingPriority(false);
    }
  };
  const loadAssignedUsers = async () => {
    if (!canAssign) return;
    setLoadingAssigned(true);
    try {
      const res = await axiosClient.get("/api/users");
      setAssignedUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading users:", err);
      setAssignedUsers([]);
    } finally {
      setLoadingAssigned(false);
    }
  };

  const loadStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await axiosClient.get("/api/status");
      setStatuses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading statuses:", err);
      setStatuses([]);
    } finally {
      setLoadingStatus(false);
    }
  };
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
      setForm((prev) => ({
        ...prev,
        status_name: data.status_name ?? data.status ?? "",
        start_date: isoToDatetimeLocalValue(
          data.start_date ?? data.startDate ?? data.start_date
        ),
        end_date: isoToDatetimeLocalValue(
          data.end_date ?? data.endDate ?? data.end_date
        ),
        assigned_to: data.assigned_to_id ?? data.assignedToId ?? "",
        priority_id: data.priority_id ?? data.priorityId ?? data.priority ?? "",
        category_id: data.category_id ?? data.categoryId ?? "",
        description: data.description ?? "",
      }));
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
    loadDepartments();
    loadStatus();
    loadCategory();
    loadPriority();
    if (canAssign) loadAssignedUsers();
    else setForm((prev) => ({ ...prev, assigned_to: "" }));
    loadTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAssign]);

  const handleBack = () => navigate("/ticket");

  const startEdit = () => {
    if (!ticket) return;
    setForm({
      status_name: ticket?.status_name ?? ticket?.status ?? "",
      start_date: isoToDatetimeLocalValue(
        ticket?.start_date ?? ticket?.startDate ?? ticket?.start_date
      ),
      end_date: isoToDatetimeLocalValue(
        ticket?.end_date ?? ticket?.endDate ?? ticket?.end_date
      ),
      assigned_to: ticket?.assigned_to_id ?? ticket?.assignedToId ?? "",
      priority_id:
        ticket?.priority_id ?? ticket?.priorityId ?? ticket?.priority ?? "",
      category_id: ticket?.category_id ?? ticket?.categoryId ?? "",
      description: ticket?.description ?? "",
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm({
      status_name: ticket?.status_name ?? ticket?.status ?? "",
      start_date: isoToDatetimeLocalValue(
        ticket?.start_date ?? ticket?.startDate ?? ticket?.start_date
      ),
      end_date: isoToDatetimeLocalValue(
        ticket?.end_date ?? ticket?.endDate ?? ticket?.end_date
      ),
      assigned_to: ticket?.assigned_to_id ?? ticket?.assignedToId ?? "",
      priority_id:
        ticket?.priority_id ?? ticket?.priorityId ?? ticket?.priority ?? "",
      category_id: ticket?.category_id ?? ticket?.categoryId ?? "",
      description: ticket?.description ?? "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSave = async () => {
    const toISO = (local) => {
      if (!local) return null;
      const d = new Date(local);
      if (isNaN(d.getTime())) return null;
      return d.toISOString();
    };

    const selectedPriority = Array.isArray(priorities)
      ? priorities.find((p) => String(p.id) === String(form.priority_id))
      : undefined;

    const payload = {
      status_id: mapStatusToId(form.status_name, ticket),
      status_name: form.status_name,
      start_date: toISO(form.start_date),
      end_date: toISO(form.end_date),
      assigned_to_id: form.assigned_to ? Number(form.assigned_to) : null,
      priority_id: form.priority_id ? form.priority_id : null,
      priority_name: selectedPriority
        ? selectedPriority.name ?? selectedPriority.label
        : undefined,
      category_id: form.category_id ? Number(form.category_id) : null,
      description: form.description,
    };

    Object.keys(payload).forEach((k) => {
      if (
        payload[k] === null ||
        payload[k] === undefined ||
        (typeof payload[k] === "string" && payload[k].trim() === "")
      ) {
        delete payload[k];
      }
    });

    try {
      setSaving(true);
      await axiosClient.patch(`/api/ticket/${id}`, payload);
      await loadTicket();
      setEditing(false);
      showSuccess("Ticket updated successfully");
    } catch (err) {
      console.error("Error saving ticket:", err);
      setError(
        err?.response?.data?.detail ??
          "Failed to save changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const mapStatusToId = (statusName, ticketData) => {
    if (!statusName) return undefined;
    if (Array.isArray(statuses) && statuses.length > 0) {
      const found = statuses.find(
        (s) =>
          String(s.name ?? s.label ?? s.status_name ?? s.value ?? "")
            .toLowerCase()
            .trim() === String(statusName).toLowerCase().trim()
      );
      if (found) return found.id ?? found.value ?? undefined;
    }
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
                disabled={!ticket || loading}
                aria-disabled={!ticket || loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                           rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
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
              onClick={() => {
                loadTicket();
                if (canAssign) loadAssignedUsers();
              }}
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
                {!editing ? (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClasses(
                      ticket.status_name ?? ticket.status
                    )}`}
                  >
                    {ticket.status_name ?? ticket.status ?? "Unknown"}
                  </span>
                ) : loadingStatus ? (
                  <p className="text-sm text-slate-400">Loading statuses...</p>
                ) : Array.isArray(statuses) && statuses.length > 0 ? (
                  <select
                    name="status_name"
                    value={form.status_name}
                    onChange={handleChange}
                    className="rounded-lg px-3 py-2 border border-slate-200 text-sm"
                  >
                    {statuses.map((s) => (
                      <option
                        key={s.id ?? s.value ?? s.name}
                        value={s.name ?? s.label ?? s.value}
                      >
                        {s.name ?? s.label ?? s.value}
                      </option>
                    ))}
                  </select>
                ) : (
                  // server returned no statuses — show editable text input instead
                  <input
                    name="status_name"
                    value={form.status_name}
                    onChange={handleChange}
                    placeholder="Type status"
                    className="rounded-lg px-3 py-2 border border-slate-200 text-sm"
                  />
                )}

                {(ticket.priority || ticket.priority_id) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                    Priority: {ticket.priority ?? ticket.priority_id}
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

                  {!editing ? (
                    <p className="text-slate-800">
                      {ticket.category_name ?? ticket.category ?? "-"}
                    </p>
                  ) : loadingCategory ? (
                    <p className="text-sm text-slate-400">
                      Loading categories...
                    </p>
                  ) : Array.isArray(categories) && categories.length > 0 ? (
                    <select
                      name="category_id"
                      value={form.category_id ?? ""}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="">-- Select category --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name ?? c.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="category_id"
                      value={form.category_id}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  )}
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
                    {formatDate(ticket.created_at)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">
                    Assigned To
                  </p>

                  {/* Editable assigned_to: use assignedUsers when editing */}
                  {!editing ? (
                    <p className="text-slate-800">
                      {
                        // try to show name from assignedUsers if id; otherwise show raw value
                        assignedUsers.find(
                          (u) => String(u.id) === String(ticket.assigned_to_id)
                        )?.username ??
                          ticket.assigned_to ??
                          "-"
                      }
                    </p>
                  ) : loadingAssigned ? (
                    <p className="text-sm text-slate-400">Loading users...</p>
                  ) : assignedUsers && assignedUsers.length > 0 ? (
                    <select
                      name="assigned_to"
                      value={form.assigned_to ?? ""}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="">-- Unassigned --</option>
                      {assignedUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.username}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="assigned_to"
                      value={form.assigned_to}
                      onChange={handleChange}
                      placeholder="Type assignee id or name"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  )}
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

                {/* Priority (editable) */}
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">
                    Priority
                  </p>
                  {!editing ? (
                    <p className="text-slate-800">{ticket.priority ?? "-"}</p>
                  ) : loadingPriority ? (
                    <p className="text-sm text-slate-400">
                      Loading priorities...
                    </p>
                  ) : Array.isArray(priorities) && priorities.length > 0 ? (
                    <select
                      name="priority_id"
                      value={form.priority_id ?? ""}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="">-- Select priority --</option>
                      {priorities.map((p) => (
                        <option
                          key={p.id ?? p.value ?? p.name}
                          value={p.id ?? p.value}
                        >
                          {p.name ?? p.label ?? p.value}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="priority_id"
                      value={form.priority_id}
                      onChange={handleChange}
                      placeholder="Type priority"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Items / Attachments */}
            {Array.isArray(ticket?.items) && ticket.items.length > 0 && (
              <div className="mt-6">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">
                  Attachments
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ticket.items.map((it, idx) => {
                    const imagePath = it.image_path
                      ? it.image_path.replace("app/", "")
                      : null;

                    const filePath = it.file_path
                      ? it.file_path.replace("app/", "")
                      : null;

                    const imageUrl = imagePath
                      ? `${API_BASE_URL}/${imagePath}`
                      : null;

                    const fileName = filePath
                      ? filePath.split("/").pop()
                      : null;

                    return (
                      <div
                        key={it.id ?? idx}
                        className="flex items-center justify-between gap-6
                       p-4 rounded-xl bg-white
                        hover:shadow-md transition"
                      >
                        {/* LEFT SIDE: IMAGE + DOWNLOAD IMAGE */}
                        <div className="flex items-center gap-3">
                          {/* IMAGE */}
                          <div className="w-24 h-16 flex items-center justify-center">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={it.description ?? "attachment"}
                                className="max-w-full max-h-full object-cover rounded-lg border"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center
                                  rounded-lg bg-slate-100 text-slate-400 text-xs"
                              >
                                NO IMAGE
                              </div>
                            )}
                          </div>

                          {/* DOWNLOAD IMAGE */}
                          {imagePath && (
                            <a
                              href={`${API_BASE_URL}/api/ticket/file/download?path=${it.image_path}`}
                              className="px-3 py-1.5 text-xs font-medium text-emerald-700
                             bg-emerald-50 border border-emerald-200 rounded-lg
                             hover:bg-emerald-100 transition whitespace-nowrap"
                            >
                              Image
                              <FontAwesomeIcon icon={faDownload} />
                            </a>
                          )}
                        </div>

                        {/* RIGHT SIDE: FILE INFO + DOWNLOAD FILE */}
                        <div className="flex items-center gap-3 min-w-0">
                          {/* FILE INFO */}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">
                              {fileName ??
                                it.description ??
                                `Attachment ${idx + 1}`}
                            </p>

                            {it.description && (
                              <p className="text-xs text-slate-500 truncate">
                                {it.description}
                              </p>
                            )}
                          </div>

                          {/* DOWNLOAD FILE */}
                          {filePath && (
                            <a
                              href={`${API_BASE_URL}/api/ticket/file/download?path=${it.file_path}`}
                              className="px-3 py-1.5 text-xs font-medium text-blue-700
                             bg-blue-50 border border-blue-200 rounded-lg
                             hover:bg-blue-100 transition whitespace-nowrap"
                            >
                              File
                              <FontAwesomeIcon icon={faDownload} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
                Description
              </p>

              {!editing ? (
                <div className="text-sm text-slate-800 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 whitespace-pre-wrap">
                  {ticket.description || "No description provided."}
                </div>
              ) : (
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  placeholder="Enter description..."
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTicket;
