import React, { useState } from "react";
import axiosClient from "../../services/axiosClient"; // your axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileExcel, faFileCsv, faSearch } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/formatdate";

const Report = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");

  // Fetch filtered reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/reports", {
        params: {
          from_date: fromDate || undefined,
          to_date: toDate || undefined,
          status: status || undefined,
        },
      });
      setReports(res.data || []);
    } catch (err) {
      console.error("Load report error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter button
  const handleFilter = (e) => {
    e.preventDefault();
    fetchReports();
  };

  // Export reports
  const handleExport = async (type) => {
    try {
      const params = new URLSearchParams({
        from_date: fromDate || "",
        to_date: toDate || "",
        status: status || "",
        type,
      });
      const response = await axiosClient.get(`/api/reports/export?${params.toString()}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      const ext = type === "excel" ? "xlsx" : type;
      link.href = url;
      link.setAttribute("download", `report.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export report.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Reports</h1>
        <div className="flex gap-2">
          <button onClick={() => handleExport("pdf")} className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
            <FontAwesomeIcon icon={faFilePdf} /> PDF
          </button>
          <button onClick={() => handleExport("excel")} className="px-3 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100">
            <FontAwesomeIcon icon={faFileExcel} /> Excel
          </button>
          <button onClick={() => handleExport("csv")} className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
            <FontAwesomeIcon icon={faFileCsv} /> CSV
          </button>
        </div>
      </div>

      {/* Filter */}
      <form onSubmit={handleFilter} className="bg-white rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-gray-600">From Date</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">To Date</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2">
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="Doing">Doing</option>
            <option value="close">Closed</option>
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" className="w-full bg-gray-900 text-white rounded-lg py-2 hover:bg-gray-800">
            <FontAwesomeIcon icon={faSearch} /> Filter
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No report data found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Assigned To</th>
                <th className="px-4 py-3 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, index) => (
                <tr key={r.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3">{r.department ?? "-"}</td>
                  <td className="px-4 py-3">{r.category}</td>
                  <td className="px-4 py-3">{r.priority}</td>
                  <td className="px-4 py-3 capitalize">{r.status}</td>
                  <td className="px-4 py-3">{r.assigned_to}</td>
                  <td className="px-4 py-3">{formatDate(r.create_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Report;
