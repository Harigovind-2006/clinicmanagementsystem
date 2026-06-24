import React from "react";
import { useNavigate } from "react-router-dom";

export default function PatientVisitTabs({ pid, historyCount = 0, activeTab }) {
  const navigate = useNavigate();

  const isCurrentActive = activeTab === "current";
  const isHistoryActive = activeTab === "history";

  return (
    <div className="flex w-full sm:w-auto mb-6 sm:mb-8 overflow-x-auto hide-scrollbar">
      {/* Current Visit Tab */}
      <button
        onClick={() => !isCurrentActive && navigate(`/patients/${pid}`)}
        className={`flex-1 sm:flex-none px-6 py-2.5 font-medium text-sm whitespace-nowrap transition-colors rounded-l-xl ${
          isCurrentActive
            ? "bg-blue-600 text-white shadow-sm cursor-default"
            : "bg-white text-gray-700 border border-r-0 border-gray-300 hover:bg-gray-50"
        }`}
      >
        Current Visit
      </button>

      {/* History Tab */}
      <button
        onClick={() => !isHistoryActive && navigate(`/patient-history/${pid}`)}
        className={`flex-1 sm:flex-none px-6 py-2.5 font-medium text-sm whitespace-nowrap transition-colors rounded-r-xl ${
          isHistoryActive
            ? "bg-blue-600 text-white shadow-sm cursor-default"
            : "bg-white text-gray-700 border border-l-0 border-gray-300 hover:bg-gray-50"
        }`}
      >
        History (2)
      </button>
    </div>
  );
}