import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";


export default function JuniorDoctor() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("assessment");

  const assessmentPatients = [
    {
      token: "#2",
      pid: "P002",
      name: "Jane Smith",
      doctor: "Dr. Priya Verma",
      specialization: "General Medicine",
      time: "09:30 AM",
      status: "Scheduled",
    },
    {
      token: "#3",
      pid: "P004",
      name: "Priya Nair",
      doctor: "Dr. Amit Sharma",
      specialization: "Cardiology",
      time: "10:00 AM",
      status: "Scheduled",
    },
    {
      token: "#4",
      pid: "P005",
      name: "Suresh Rao",
      doctor: "Dr. Amit Sharma",
      specialization: "Cardiology",
      time: "11:00 AM",
      status: "Scheduled",
    },
  ];

  const submittedPatients = [
    {
      token: "#5",
      pid: "P008",
      name: "Rahul Das",
      doctor: "Dr. Priya Verma",
      specialization: "Neurology",
      time: "12:30 PM",
      status: "Submitted",
    },
  ];

  const displayedPatients =
    activeTab === "assessment"
      ? assessmentPatients
      : submittedPatients;

  return (
    <>
      <Layout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:ml-64 min-h-screen bg-gray-50">
        {/* Header */}
        <header className="h-16 bg-white flex items-center justify-between px-4 md:px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-2xl"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>

            <h2 className="text-lg md:text-xl font-semibold">
              Junior Doctor
            </h2>
          </div>

          <button className="text-gray-600 hover:text-red-500">
            Logout
          </button>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Click a patient to open their assessment page
          </p>

          {/* Tabs */}
          <div className="mt-8 flex">
            <button
              onClick={() => setActiveTab("assessment")}
              className={`px-6 py-3 rounded-l-xl font-medium transition ${
                activeTab === "assessment"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700"
              }`}
            >
              For Assessment ({assessmentPatients.length})
            </button>

            <button
              onClick={() => setActiveTab("submitted")}
              className={`px-6 py-3 rounded-r-xl font-medium transition ${
                activeTab === "submitted"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700"
              }`}
            >
              Waiting / Submitted ({submittedPatients.length})
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block mt-6 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-8 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
              <div>Token</div>
              <div>PID</div>
              <div>Patient Name</div>
              <div>Doctor</div>
              <div>Specialization</div>
              <div>Time</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            {displayedPatients.map((patient) => (
              <div
                key={patient.pid}
                className="grid grid-cols-8 px-6 py-4 border-t border-gray-100 items-center"
              >
                <div>{patient.token}</div>
                <div>{patient.pid}</div>
                <div>{patient.name}</div>
                <div>{patient.doctor}</div>
                <div>{patient.specialization}</div>
                <div>{patient.time}</div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      patient.status === "Submitted"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>

                {activeTab === "assessment" ? (
                  <button
                    onClick={() =>
                      navigate(`/assessment/${patient.pid}`, {
                        state: patient,
                      })
                    }
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Assess
                  </button>
                ) : (
                  <button
                    className="text-green-600 font-medium"
                  >
                    View
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden mt-6 space-y-4">
            {displayedPatients.map((patient) => (
              <div
                key={patient.pid}
                className="bg-white rounded-xl shadow-sm p-4"
              >
                <div className="space-y-2">
                  <p>
                    <strong>PID:</strong> {patient.pid}
                  </p>

                  <p>
                    <strong>Name:</strong> {patient.name}
                  </p>

                  <p>
                    <strong>Doctor:</strong> {patient.doctor}
                  </p>

                  <p>
                    <strong>Specialization:</strong>{" "}
                    {patient.specialization}
                  </p>

                  <p>
                    <strong>Time:</strong> {patient.time}
                  </p>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      patient.status === "Submitted"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>

                {activeTab === "assessment" ? (
                  <button
                    onClick={() =>
                      navigate(`/assessment/${patient.pid}`, {
                        state: patient,
                      })
                    }
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    Assess
                  </button>
                ) : (
                  <button
                    className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg"
                  >
                    View
                  </button>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}