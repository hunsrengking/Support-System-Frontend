// src/views/settings/positions/Position.jsx
import React, { useState, useEffect } from "react";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faTrash } from "@fortawesome/free-solid-svg-icons";

const Position = () => {
  // ================= STATE =================
  const [positionId, setPositionId] = useState(null);

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [positions, setPositions] = useState([]);

  // ================= FETCH =================
  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoadingList(true);
      const res = await axiosClient.get("api/positions");
      setPositions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  // ================= SAVE / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        level,
        min_salary: minSalary,
        max_salary: maxSalary,
        is_active: isActive,
      };

      if (positionId) {
        await axiosClient.put(`/api/positions/${positionId}`, payload);
      } else {
        await axiosClient.post("/api/positions", payload);
      }

      resetForm();
      fetchPositions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= SELECT ROW =================
  const handleSelectRow = (item) => {
    setPositionId(item.id);
    setTitle(item.title);
    setLevel(item.level);
    setMinSalary(item.min_salary);
    setMaxSalary(item.max_salary);
    setIsActive(!!item.is_active);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this position?")) return;

    try {
      await axiosClient.delete(`/api/positions/${id}`);
      fetchPositions();

      if (positionId === id) resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setPositionId(null);
    setTitle("");
    setLevel("");
    setMinSalary("");
    setMaxSalary("");
    setIsActive(true);
  };

  // ================= UI =================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FontAwesomeIcon icon={faBriefcase} />
          Position Management
        </h1>
        <p className="text-sm text-slate-500">
          Click row to edit, delete from action column
        </p>
      </div>

      {/* FORM + LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* FORM (SMALL) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm space-y-4"
        >
          <div>
            <label className="text-sm">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full mt-1 border rounded-xl p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-sm">Level</label>
            <input
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              placeholder="Junior / Senior / Manager"
              className="w-full mt-1 border rounded-xl p-2.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Min Salary</label>
              <input
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                required
                className="w-full mt-1 border rounded-xl p-2.5 text-sm"
              />
            </div>

            <div>
              <label className="text-sm">Max Salary</label>
              <input
                type="number"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                required
                className="w-full mt-1 border rounded-xl p-2.5 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Active</span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative h-6 w-11 rounded-full ${
                isActive ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 bg-white rounded-full transition ${
                  isActive ? "left-5" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
              {positionId ? "Update" : "Save"}
            </button>

            {positionId && (
              <button
                type="button"
                onClick={resetForm}
                className="border px-4 py-2 rounded-xl"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* LIST (BIG) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Position List</h2>

          {loadingList ? (
            <p className="text-sm">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Level</th>
                  <th className="p-2 text-left">Salary</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleSelectRow(item)}
                    className={`border-t cursor-pointer hover:bg-blue-50 ${
                      positionId === item.id ? "bg-blue-100" : ""
                    }`}
                  >
                    <td className="p-2">{item.title}</td>
                    <td className="p-2">{item.level}</td>
                    <td className="p-2">
                      ${item.min_salary} - ${item.max_salary}
                    </td>
                    <td className="p-2 text-center">
                      {item.is_active ? "Active" : "Inactive"}
                    </td>
                    <td
                      className="p-2 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Position;
