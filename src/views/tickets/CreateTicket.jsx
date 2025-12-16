/* eslint-disable react-hooks/exhaustive-deps */
// src/views/tickets/CreateTicket.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faFile } from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../../utils/permission";

const fileId = (f) => `${f.name}_${f.size}_${f.lastModified}`;

const CreateTicket = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject: "",
    description: "",
    priority: "",
    category: "",
    assigned_to: "",
    department: "",
    start_date: "",
    end_date: "",
    images: [],
    attachments: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const imageUrlsRef = useRef(new Set());
  const imageInputRef = useRef(null);
  const attachmentInputRef = useRef(null);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingPriority, setLoadingPriority] = useState(false);
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canAssign = hasPermission("ASSIGN_TO_STAFF");

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

  useEffect(() => {
    loadDepartments();
    loadCategory();
    loadPriority();
    if (canAssign) loadAssignedUsers();
    else setForm((prev) => ({ ...prev, assigned_to: "" }));
  }, []);

  useEffect(() => {
    return () => {
      imageUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.log(e);
        }
      });
      imageUrlsRef.current.clear();
    };
  }, []);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      if (name === "images") {
        const newFiles = Array.from(files || []);
        const existing = form.images || [];
        const merged = [...existing];

        const addedFiles = [];
        newFiles.forEach((f) => {
          const id = fileId(f);
          const isDup = merged.some((m) => fileId(m) === id);
          if (!isDup) {
            merged.push(f);
            addedFiles.push(f);
          }
        });

        const newPreviews = addedFiles.map((f) => {
          const url = URL.createObjectURL(f);
          imageUrlsRef.current.add(url);
          return {
            id: fileId(f),
            url,
            name: f.name,
            size: f.size,
            lastModified: f.lastModified,
          };
        });

        setImagePreviews((prev) => [...prev, ...newPreviews]);
        setForm((prev) => ({ ...prev, images: merged }));
      }

      if (name === "attachments") {
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

  const removeImageById = (idToRemove) => {
    setImagePreviews((prevPreviews) => {
      const toRemove = prevPreviews.find((p) => p.id === idToRemove);
      if (toRemove) {
        try {
          URL.revokeObjectURL(toRemove.url);
        } catch (e) {
          console.log(e);
        }
        imageUrlsRef.current.delete(toRemove.url);
      }
      return prevPreviews.filter((p) => p.id !== idToRemove);
    });

    setForm((prev) => {
      const images = (prev.images || []).filter(
        (f) => fileId(f) !== idToRemove
      );

      if (images.length === 0 && imageInputRef.current) {
        try {
          imageInputRef.current.value = "";
        } catch (e) {
          console.log(e);
        }
      }

      return { ...prev, images };
    });
  };

  const removeAttachmentAt = (index) => {
    setForm((prev) => {
      const attachments = [...prev.attachments];
      if (index >= 0 && index < attachments.length)
        attachments.splice(index, 1);
      if (attachments.length === 0 && attachmentInputRef.current) {
        try {
          attachmentInputRef.current.value = "";
        } catch (e) {
          console.log(e);
        }
      }

      return { ...prev, attachments };
    });
  };
  const uploadTicketImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axiosClient.post("/api/ticket/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.image_path;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let items = [];

      // upload image first
      if (form.images?.length > 0) {
        const imagePath = await uploadTicketImage(form.images[0]);
        items.push({
          image_path: imagePath,
          description: "Image attachment",
        });
      }

      // upload file first
      if (form.attachments?.length > 0) {
        const formData = new FormData();
        formData.append("file", form.attachments[0]);

        const res = await axiosClient.post("/api/ticket/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        items.push({
          file_path: res.data.file_path,
          description: "File attachment",
        });
      }

      const payload = {
        title: form.subject,
        description: form.description || null,
        priority_id: form.priority || null,
        category_id: form.category || null,
        assigned_to_id: canAssign ? form.assigned_to || null : null,
        assigned_to_department_id: form.department || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        items: items.length > 0 ? items : null,
      };

      await axiosClient.post("/api/ticket", payload);

      navigate("/ticket", {
        state: { success: "Ticket created successfully" },
      });
    } catch (err) {
      console.error(err);
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
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none"
              placeholder="Short title for the ticket"
            />
          </div>

          {/* Category / Assigned To/ Priority  */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="">Select priority</option>
                {loadingPriority ? (
                  <option value="" disabled>
                    Loading...
                  </option>
                ) : priorities.length > 0 ? (
                  priorities.map((p) => (
                    <option key={p.id ?? p.name} value={p.id ?? p.name}>
                      {p.name}
                    </option>
                  ))
                ) : (
                  <option value="">No priorities available</option>
                )}
              </select>
            </div>
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
                {loadingCategory ? (
                  <option value="" disabled>
                    Loading...
                  </option>
                ) : categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.id ?? c.name} value={c.id ?? c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option value="">No categories available</option>
                )}
              </select>
            </div>

            {/* Assigned To: only show/select if user has permission */}
            {canAssign ? (
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
                  {loadingAssigned ? (
                    <option value="" disabled>
                      Loading...
                    </option>
                  ) : assignedUsers.length > 0 ? (
                    assignedUsers.map((u) => (
                      <option
                        key={u.id ?? u.username}
                        value={u.id ?? u.username}
                      >
                        {u.name ?? u.username}
                      </option>
                    ))
                  ) : (
                    <option value="">No users available</option>
                  )}
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Assigned To
                </label>
                <div className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-600">
                  Unassigned — you don't have permission to assign staff
                </div>
              </div>
            )}
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
                {loadingDepartments ? (
                  <option value="" disabled>
                    Loading...
                  </option>
                ) : (
                  departments.map((d) => (
                    <option key={d.id ?? d.name} value={d.id ?? d.name}>
                      {d.name}
                    </option>
                  ))
                )}
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

          {/* Images / Attachments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Images
              </label>
              <input
                ref={imageInputRef}
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
              {imagePreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {imagePreviews.map((p) => (
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
                        onClick={() => removeImageById(p.id)}
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

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Attachments
              </label>
              <input
                ref={attachmentInputRef}
                type="file"
                name="attachments"
                multiple
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.sql"
                className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
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
