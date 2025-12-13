import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Telegram = () => {
  const navigate = useNavigate();

  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosClient.post("/api/telegram", {
        bot_token: botToken,
        chat_id: chatId,
        is_active: isActive,
      });

      navigate("/setting");
    } catch (error) {
      console.error("Create telegram config error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faPaperPlane} />
          Telegram Configuration
        </h1>
        <p className="text-sm text-slate-500">
          Configure Telegram bot notification settings.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 max-w-xl"
      >
        {/* Bot Token */}
        <div>
          <label className="text-sm text-slate-600">Bot Token</label>
          <input
            type="text"
            required
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            className="w-full mt-1 border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="123456:AAxxxxxxxxxxxx"
          />
        </div>

        {/* Chat ID */}
        <div>
          <label className="text-sm text-slate-600">Chat ID</label>
          <input
            type="text"
            required
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            className="w-full mt-1 border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="-100xxxxxxxxxx"
          />
        </div>

        {/* Active Switch */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-sm text-slate-600">Active</span>

          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              isActive ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center gap-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Telegram;
