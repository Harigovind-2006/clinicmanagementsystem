import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

export default function SeniorDoctorDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("waiting");

  const current = new Date();
  const formattedDate = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

  const patients = [
    {
      token: 1,
      pid: "P001",
      pname: "John Doe",
      gender: "Male",
      blood: "O+",
      date: "2026-06-15",
      time: "9:00 AM",
      status: false,
      dob: "1985-04-12",
      phone: "9001234567",
      notes: "Patient recovering well. Continue medication.",
      observations: "Patient complains of chest pain and shortness of breath.",
      bp: "120/80",
      pulse: "72 bpm",
      temp: "98.6°F",
      weight: "75 kg",
    },
    {
      token: 2,
      pid: "P002",
      pname: "Priya Sharma",
      gender: "Female",
      blood: "A+",
      date: "2026-06-15",
      time: "9:30 AM",
      status: false,
      dob: "1992-08-25",
      phone: "9876543210",
      notes: "Responding well to treatment.",
      observations: "Mild fever and fatigue.",
      bp: "118/76",
      pulse: "78 bpm",
      temp: "99.1°F",
      weight: "62 kg",
    },
    {
      token: 3,
      pid: "P003",
      pname: "Ravi Kumar",
      gender: "Male",
      blood: "B+",
      date: "2026-06-15",
      time: "10:00 AM",
      status: false,
      dob: "1972-01-15",
      phone: "9003456789",
      notes: "Stable condition. Under observation.",
      observations: "History of hypertension.",
      bp: "130/85",
      pulse: "74 bpm",
      temp: "98.4°F",
      weight: "81 kg",
    },
    {
      token: 4,
      pid: "P004",
      pname: "Anjali Gupta",
      gender: "Female",
      blood: "AB+",
      date: "2026-06-15",
      time: "10:30 AM",
      status: true,
      dob: "1988-11-05",
      phone: "9812345678",
      notes: "Post-surgery recovery progressing well.",
      observations: "No signs of infection.",
      bp: "115/72",
      pulse: "70 bpm",
      temp: "98.2°F",
      weight: "58 kg",
    },
    {
      token: 5,
      pid: "P005",
      pname: "Suresh Rao",
      gender: "Male",
      blood: "AB+",
      date: "2026-06-15",
      time: "11:00 AM",
      status: false,
      dob: "1968-09-18",
      phone: "9123456780",
      notes: "Diabetic patient. Monitor sugar levels.",
      observations: "Occasional dizziness reported.",
      bp: "140/90",
      pulse: "80 bpm",
      temp: "98.7°F",
      weight: "84 kg",
    },
  ];

  const waitingCount = patients.filter((patient) => !patient.status).length;
  const completedCount = patients.filter((patient) => patient.status).length;

  const filteredPatients = patients.filter((patient) =>
    activeTab === "waiting" ? !patient.status : patient.status
  );

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
            ===
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
                {filteredPatients.map((patient) => (
                  <tr key={patient.pid} className="hover:bg-gray-50/50 transition-colors whitespace-nowrap">
                    <td className="p-4 text-sm font-semibold text-blue-600">
                      #{patient.token}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {patient.pid}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-700">
                      {patient.pname}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {patient.date}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {patient.time}
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          patient.status
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-yellow-50 text-yellow-700 border-yellow-100"
                        }`}
                      >
                        {patient.status ? "Completed" : "Waiting"}
                      </span>
                    </td>
                    <td className="p-4 text-sm pr-6 text-right">
                      <button
                        onClick={() =>
                          navigate(`/senior-dashboard/${patient.pid}`, {
                            state: patient,
                          })
                        }
                        className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                      >
                        Open Consultation
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-sm text-gray-400 italic bg-gray-50/30">
                      No matching queue assignments recorded under this category.
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