import React from "react";
import { useNavigate } from "react-router-dom";

export default function PatientVisitTabs({
  id, // ✅ Expects 'id'
  historyCount = 0,
  activeTab,
}) {
  const navigate = useNavigate();

  const isCurrentActive = activeTab === "current";
  const isHistoryActive = activeTab === "history";

  return (
    <div className="flex w-full sm:w-auto mb-6 sm:mb-8 overflow-x-auto hide-scrollbar">
      <button
        onClick={() => !isCurrentActive && navigate(`/patients/${id}`)}
        className={`flex-1 sm:flex-none px-6 py-2.5 font-medium text-sm whitespace-nowrap transition-colors rounded-l-xl ${
          isCurrentActive
            ? "bg-blue-600 text-white shadow-sm cursor-default"
            : "bg-white text-gray-700 border border-r-0 border-gray-300 hover:bg-gray-50"
        }`}
      >
        Current Visit
      </button>

      <button
        onClick={() => !isHistoryActive && navigate(`/patients/history/${id}`)}
        className={`flex-1 sm:flex-none px-6 py-2.5 font-medium text-sm whitespace-nowrap transition-colors rounded-r-xl ${
          isHistoryActive
            ? "bg-blue-600 text-white shadow-sm cursor-default"
            : "bg-white text-gray-700 border border-l-0 border-gray-300 hover:bg-gray-50"
        }`}
      >
        History ({historyCount})
      </button>
    </div>
  );
}