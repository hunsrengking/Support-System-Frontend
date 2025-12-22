// src/views/settings/department/DepartmentMember.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useError } from "../../../context/ErrorContext";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserPlus,
  faTrash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 10;

const DepartmentMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useError();
  const [department, setDepartment] = useState(null);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  // Load department + members
  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/api/department/${id}`);
      setDepartment(res.data || null);
      setMembers(res.data?.members || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load department members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line
  }, [id]);

  // Load users for add modal
  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axiosClient.get("/api/users/without/departmemt");
      setAllUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadAllUsers();
  }, []);

  // Search
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
    const ids = new Set(members.map((m) => m.id));
    return allUsers.filter((u) => !ids.has(u.id));
  }, [members, allUsers]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post(`/api/department/${id}/members/add`, {
        userId: selectedUserId,
      });
      setIsAddOpen(false);
      loadMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to add member.");
    }
  };

  // Remove member
  const handleRemove = async (userId, name) => {
    if (!window.confirm(`Remove ${name}?`)) return;
    try {
      await axiosClient.delete(`/api/department/${id}/members/${userId}remove`);
      setMembers((prev) => prev.filter((m) => m.id !== userId));
    } catch (err) {
      console.error(err);
      showError("Failed to remove member.");
    }
  };

  if (loading)
    return <p className="text-sm text-slate-500">Loading members...</p>;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faUsers} />
            Members — {department?.name}
          </h1>
          <p className="text-sm text-slate-500">
            Manage users in this department.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-44"
            />
          </div>

          {/* Add */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl shadow hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            Add Member
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">No members found.</p>
        ) : (
          <div className="overflow-x-auto">
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
                {pageItems.map((m, index) => (
                  <tr
                    key={m.id}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="py-2 pr-4">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="py-2 pr-4 font-medium text-slate-800">
                      {m.firstName} {m.lastName}
                    </td>
                    <td className="py-2 pr-4 text-slate-600">{m.email}</td>
                    <td className="py-2 pr-4 text-slate-600">
                      {m.jobTitle || "-"}
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            handleRemove(m.id, `${m.firstName} ${m.lastName}`)
                          }
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1"
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
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex justify-between text-sm text-slate-500">
          <span>
            Page {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
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
            className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Add Member</h3>

            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm"
              required
            >
              <option value="">-- Select user --</option>
              {loadingUsers ? (
                <option disabled>Loading...</option>
              ) : (
                candidateUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} — {u.email}
                  </option>
                ))
              )}
            </select>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 border rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
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
