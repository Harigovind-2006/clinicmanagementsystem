import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";

export default function SeniorDoctorDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("waiting");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const current = new Date();
  const formattedDate = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

  // Fetch ALL appointments on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await api.get("/appoinmentapi");
      const data = res.data.data || res.data;
      setPatients(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setErrorMsg("Failed to load appointments. Please refresh the page.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter counts based on status
  const waitingCount = patients.filter(
    (patient) => patient.status === "waiting"
  ).length;

  const completedCount = patients.filter(
    (patient) => patient.status === "completed"
  ).length;

  const filteredPatients = patients.filter((patient) =>
    activeTab === "waiting"
      ? patient.status === "waiting"
      : patient.status === "completed"
  );

  // Loading state
  if (loading) {
    return (
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading appointments...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      {/* Outer viewport boundary container */}
      <div className="w-full max-w-full block overflow-hidden bg-gray-50 p-4 sm:p-6 lg:p-8">
        
        {/* Header Section */}
        <div className="mb-6 w-full flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 border border-gray-200 rounded-lg bg-white"
          >
            ☰
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
              Senior Doctor Dashboard
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 break-words">
              {formattedDate} &bull; Patient Queue Management
            </p>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg("")}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setActiveTab("waiting")}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl border transition-all ${
              activeTab === "waiting"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Waiting ({waitingCount})
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl border transition-all ${
              activeTab === "completed"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Scrollable Table View Wrapper */}
        <div className="w-full max-w-full block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="w-full block overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse table-auto">
              <thead className="bg-gray-50/70 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Token</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">PID</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Date</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Scheduled Time</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Status</th>
                  <th className="p-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pr-6 w-44">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50/50 transition-colors whitespace-nowrap">
                      <td className="p-4 text-sm font-semibold text-blue-600">
                        #{patient.tokenNumber || "-"}
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-900">
                        {patient.patient?.pid || "N/A"}
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-700">
                        {patient.patient?.name || "Unknown"}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {patient.appointmentDate 
                          ? new Date(patient.appointmentDate).toLocaleDateString() 
                          : "N/A"}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {patient.appointmentTime || "N/A"}
                      </td>
                      <td className="p-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            patient.status === "completed"
                              ? "bg-green-50 text-green-700 border-green-100"
                              : patient.status === "waiting"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                              : "bg-blue-50 text-blue-700 border-blue-100"
                          }`}
                        >
                          {patient.status 
                            ? patient.status.charAt(0).toUpperCase() + patient.status.slice(1)
                            : "Unknown"}
                        </span>
                      </td>
                      <td className="p-4 text-sm pr-6 text-right">
                        <button
                          onClick={() =>
                            navigate(`/senior-dashboard/${patient._id}`, {
                              state: patient,
                            })
                          }
                          className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                        >
                          {patient.status === "completed" ? "View" : "Open Consultation"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-sm text-gray-400 italic bg-gray-50/30">
                      No {activeTab === "waiting" ? "waiting" : "completed"} patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}