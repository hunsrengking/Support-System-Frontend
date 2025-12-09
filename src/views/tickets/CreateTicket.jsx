// src/views/tickets/CreateTicket.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faFile } from "@fortawesome/free-solid-svg-icons";

const CreateTicket = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject: "",
    description: "",
    priority: "Medium",
    status: "Open",
    category: "",
    assigned_to: "",
    department: "",
    start_date: "",
    end_date: "",
    images: [], // array of image Files
    attachments: [], // array of attachment Files (docs, pdf, excel, txt, sql)
  });

  // previews: array of { id, url, name } for images
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // cleanup object URLs when unmounting
  useEffect(() => {
    return () => {
      imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      if (name === "images") {
        const newFiles = Array.from(files || []);
        const existing = form.images || [];
        const merged = [...existing];

        newFiles.forEach((f) => {
          const isDup = merged.some(
            (m) =>
              m.name === f.name &&
              m.size === f.size &&
              m.lastModified === f.lastModified
          );
          if (!isDup) merged.push(f);
        });

        const newPreviews = newFiles
          .filter(
            (f) =>
              !imagePreviews.some(
                (p) =>
                  p.name === f.name &&
                  p.size === f.size &&
                  p.lastModified === f.lastModified
              )
          )
          .map((f) => ({
            id: `${f.name}_${f.size}_${f.lastModified}`,
            url: URL.createObjectURL(f),
            name: f.name,
            size: f.size,
            lastModified: f.lastModified,
          }));

        setForm((prev) => ({ ...prev, images: merged }));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
      }

      if (name === "attachments") {
        // Accept multiple attachments (docs/pdf/excel/txt/sql)
        const newFiles = Array.from(files || []);
        const existing = form.attachments || [];
        const merged = [...existing];

        newFiles.forEach((f) => {
          const isDup = merged.some(
            (m) =>
              m.name === f.name &&
              m.size === f.size &&
              m.lastModified === f.lastModified
          );
          if (!isDup) merged.push(f);
        });

        setForm((prev) => ({ ...prev, attachments: merged }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeImageAt = (index) => {
    const toRemove = imagePreviews[index];
    if (toRemove) {
      URL.revokeObjectURL(toRemove.url);
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      setForm((prev) => {
        const images = [...prev.images];
        images.splice(index, 1);
        return { ...prev, images };
      });
    }
  };

  const removeAttachmentAt = (index) => {
    setForm((prev) => {
      const attachments = [...prev.attachments];
      attachments.splice(index, 1);
      return { ...prev, attachments };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = new FormData();

      // append regular fields (skip arrays handled below)
      Object.entries(form).forEach(([key, value]) => {
        if (key === "images" || key === "attachments") return;
        if (value !== null && value !== "") {
          payload.append(key, value);
        }
      });

      // append images as images[]
      if (form.images && form.images.length) {
        form.images.forEach((file) => {
          payload.append("images[]", file);
        });
      }

      // append attachments as attachments[]
      if (form.attachments && form.attachments.length) {
        form.attachments.forEach((file) => {
          payload.append("attachments[]", file);
        });
      }

      await axiosClient.post("/api/tickets", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/tickets");
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError("Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Create Ticket
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Create a new support ticket.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Subject */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl
                         focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none"
              placeholder="Short title for the ticket"
            />
          </div>

          {/* Priority / Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 bg-white outline-none"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 bg-white outline-none"
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </div>
          </div>

          {/* Category / Assigned To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 bg-white outline-none"
              >
                <option value="">Select category</option>
                <option value="Bug">Bug</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Support">Support</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Assigned To
              </label>
              <select
                name="assigned_to"
                value={form.assigned_to}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 bg-white outline-none"
              >
                <option value="">Unassigned</option>
                <option value="user_1">User 1</option>
                <option value="user_2">User 2</option>
                <option value="user_3">User 3</option>
              </select>
            </div>
          </div>

          {/* Dept / Start / End */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Department
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 bg-white outline-none"
              >
                <option value="">Select department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="Operation">Operation</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Multi Images / Attachments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Multi Images */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Images
              </label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />

              {/* image previews grid */}
              {imagePreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {imagePreviews.map((p, i) => (
                    <div
                      key={p.id}
                      className="relative rounded-xl overflow-hidden border"
                    >
                      <img
                        src={p.url}
                        alt={p.name}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageAt(i)}
                        className="absolute top-1 right-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-red-600 shadow"
                        title="Remove"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attachments (docs, pdf, excel, txt, sql) */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Attachments
              </label>
              <input
                type="file"
                name="attachments"
                multiple
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.sql"
                className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />

              {/* attachments list */}
              {form.attachments && form.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {form.attachments.map((f, i) => (
                    <div
                      key={`${f.name}_${f.size}_${f.lastModified}`}
                      className="flex items-center justify-between gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-7 h-7 flex items-center justify-center rounded bg-white border">
                          <FontAwesomeIcon icon={faFile} />
                        </div>
                        <div className="text-sm text-slate-700 truncate">
                          {f.name}
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => removeAttachmentAt(i)}
                          className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-xl bg-red-50 text-red-700 border border-red-100"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none resize-y"
              placeholder="Describe the issue or request..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faSave} className="text-xs" />
              {submitting ? "Saving..." : "Save Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
