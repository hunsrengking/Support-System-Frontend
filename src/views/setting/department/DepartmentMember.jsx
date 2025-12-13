// src/views/settings/department/DepartmentMember.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUserPlus,
  faUsers,
  faTrash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 10;

const DepartmentMember = () => {
  const { id } = useParams(); // department id
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);

  // UI state
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  // Load department and members
  const loadMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get(`/api/department/${id}`);
      setDepartment(res.data || null);

      // endpoint for members: try /api/department/:id/members
      const membersRes = await axiosClient.get(`/api/department/${id}/members`);
      setMembers(membersRes.data || []);
    } catch (err) {
      console.error("Load department/members error:", err);
      setError("Failed to load department members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Load all users (for add modal)
  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axiosClient.get("/api/users");
      setAllUsers(res.data || []);
    } catch (err) {
      console.error("Load users error:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    // prefetch users so Add modal is faster
    loadAllUsers();
  }, []);

  // Filtered + search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => {
      const name = `${m.firstName || ""} ${m.lastName || ""}`.toLowerCase();
      const email = (m.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [members, query]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // Add member
  const candidateUsers = useMemo(() => {
    // exclude existing members by user id or email
    const memberIds = new Set(members.map((m) => m.id));
    return allUsers.filter((u) => !memberIds.has(u.id));
  }, [allUsers, members]);

  const handleOpenAdd = () => {
    setSelectedUserId("");
    setIsAddOpen(true);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    try {
      // POST /api/department/:id/members  { userId }
      await axiosClient.post(`/api/department/${id}/members`, {
        userId: selectedUserId,
      });
      // reload
      await loadMembers();
      setIsAddOpen(false);
    } catch (err) {
      console.error("Add member error:", err);
      alert("Failed to add member. Check console for details.");
    }
  };

  // Remove member
  const handleRemove = async (userId, name) => {
    if (!window.confirm(`Remove ${name} from this department?`)) return;
    try {
      // DELETE /api/department/:id/members/:userId
      await axiosClient.delete(`/api/department/${id}/members/${userId}`);
      setMembers((prev) => prev.filter((m) => m.id !== userId));
    } catch (err) {
      console.error("Remove member error:", err);
      alert("Failed to remove member. Check console for details.");
    }
  };

  if (loading)
    return (
      <div className="p-6">
        <p className="text-sm text-slate-500">Loading members...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md hover:bg-slate-100"
            aria-label="Back"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} />
              Members — {department?.name || "Department"}
            </h2>
            <p className="text-sm text-slate-500">
              Manage members of this department.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            Add Member
          </button>

          <Link
            to="/settings/department"
            className="px-3 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
          >
            Back to Departments
          </Link>
        </div>
      </div>

      {/* Search + stats */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search members by name or email..."
              className="bg-transparent outline-none text-sm"
            />
          </div>
          <div className="text-sm text-slate-500">
            {members.length} total members
          </div>
        </div>

        <div className="text-sm text-slate-500">
          Page {page} / {totalPages}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl p-4 border shadow-sm overflow-x-auto">
        {members.length === 0 ? (
          <div className="text-sm text-slate-500 py-6 text-center">
            No members in this department yet.
          </div>
        ) : pageItems.length === 0 ? (
          <div className="text-sm text-slate-500 py-6 text-center">
            No members match your search.
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Job Title</th>
                <th className="py-2 pr-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((m, idx) => (
                <tr
                  key={m.id}
                  className="border-b last:border-b-0 hover:bg-slate-50"
                >
                  <td className="py-3 pr-4">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td className="py-3 pr-4 font-medium text-slate-800">
                    {(m.firstName || "") + " " + (m.lastName || "")}
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{m.email || "-"}</td>
                  <td className="py-3 pr-4 text-slate-600">
                    {m.jobTitle || "-"}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() =>
                          handleRemove(
                            m.id,
                            `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
                              m.email
                          )
                        }
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs hover:bg-red-100 shadow-sm"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination controls */}
      {members.length > PAGE_SIZE && (
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border shadow-sm">
          <div className="text-sm text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1} -{" "}
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <div className="text-sm">{page}</div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsAddOpen(false)}
          />
          <form
            onSubmit={handleAddMember}
            className="relative z-10 w-full max-w-md bg-white rounded-2xl p-6 border shadow-lg"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faUserPlus} />
              Add Member
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Choose a user to add to <strong>{department?.name}</strong>.
            </p>

            <div className="space-y-3">
              <label className="text-sm text-slate-600">Select user</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full mt-1 border rounded-xl p-2.5 text-sm"
                required
              >
                <option value="">-- Select user --</option>
                {loadingUsers ? (
                  <option disabled>Loading users...</option>
                ) : candidateUsers.length === 0 ? (
                  <option disabled>No available users</option>
                ) : (
                  candidateUsers.map((u) => (
                    <option value={u.id} key={u.id}>
                      {u.firstName} {u.lastName} — {u.email}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 rounded-xl border text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DepartmentMember;
