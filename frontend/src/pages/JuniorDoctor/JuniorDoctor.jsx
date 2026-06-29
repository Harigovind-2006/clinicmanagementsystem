import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";
export default function JuniorDoctor() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("assessment");
  useEffect(() => {
    // Fetch patients data from the API
    const fetchPatients = async () => { 
      const response = await api.get(`/patientapi/`);
      const data = response.data;
      setPatients(data);
    } 
  }
  );
  
  const displayedPatients =
    activeTab === "assessment" ? assessmentPatients : submittedPatients;

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="w-full">
        {/* Title Block */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-[#64748B] text-[15px]">
            Click a patient to open their assessment page
          </p>
        </div>

        {/* Custom Pill Tab Controls */}
        <div className="flex gap-2 mb-8 bg-[#F1F5F9] p-1.5 rounded-xl w-fit border border-[#E2E8F0]">
          <button
            onClick={() => setActiveTab("assessment")}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "assessment"
                ? "bg-[#0052FF] text-white shadow-sm"
                : "text-[#64748B] hover:text-[#334155]"
            }`}
          >
            For Assessment ({assessmentPatients.length})
          </button>

          <button
            onClick={() => setActiveTab("submitted")}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "submitted"
                ? "bg-[#0052FF] text-white shadow-sm"
                : "text-[#64748B] hover:text-[#334155]"
            }`}
          >
            Waiting / Submitted ({submittedPatients.length})
          </button>
        </div>

        {/* Main Records Frame Table */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-max table-auto text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#64748B] font-semibold text-[13px] tracking-wider uppercase border-b border-[#E2E8F0]">
                  <th className="px-6 py-4.5 font-semibold">Token</th>
                  <th className="px-6 py-4.5 font-semibold">PID</th>
                  <th className="px-6 py-4.5 font-semibold">Patient Name</th>
                  <th className="px-6 py-4.5 font-semibold">Doctor</th>
                  <th className="px-6 py-4.5 font-semibold">Specialization</th>
                  <th className="px-6 py-4.5 font-semibold">Time</th>
                  <th className="px-6 py-4.5 font-semibold">Status</th>
                  <th className="px-6 py-4.5 text-right font-semibold pr-10">Action</th>
                </tr>
              </thead>
              <tbody className="text-[#334155] text-[14px] divide-y divide-[#F1F5F9]">
                {displayedPatients.map((patient) => (
                  <tr
                    key={patient.pid}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="px-6 py-4.5 text-[#0F172A] font-medium">{patient.token}</td>
                    <td className="px-6 py-4.5 text-[#64748B]">{patient.pid}</td>
                    <td className="px-6 py-4.5 font-semibold text-[#0F172A]">{patient.name}</td>
                    <td className="px-6 py-4.5 text-[#64748B]">{patient.doctor}</td>
                    <td className="px-6 py-4.5 text-[#64748B]">{patient.specialization}</td>
                    <td className="px-6 py-4.5 text-[#64748B]">{patient.time}</td>
                    <td className="px-6 py-4.5">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                          patient.status === "Submitted"
                            ? "bg-green-50 text-green-600 border border-green-100"
                            : "bg-[#DBEAFE] text-[#2563EB]"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right pr-10">
                      {activeTab === "assessment" ? (
                        <button
                          onClick={() =>
                            navigate(`/assessment/${patient.pid}`, {
                              state: patient,
                            })
                          }
                          className="text-[#2563EB] hover:text-[#1d4ed8] font-semibold text-sm transition-colors"
                        >
                          Assess
                        </button>
                      ) : (
                        <button className="text-[#64748B] hover:text-[#475569] font-semibold text-sm transition-colors">
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}