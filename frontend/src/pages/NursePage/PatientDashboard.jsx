import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

import Overview from "./components/Overview";
import Medicines from "./components/Medicines";
import Procedure from "./components/Procedure";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const patient = location.state;

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">
          Patient Not Found
        </h1>
      </div>
    );
  }

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 bg-white rounded-lg shadow"
          >
            ☰
          </button>

          <div className="flex-1">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 text-sm font-medium mb-1"
            >
              ← Back
            </button>

            <h1 className="text-3xl font-bold text-gray-900">
              {patient.pname}
            </h1>

            <p className="text-gray-500">
              Patient ID: {patient.pid}
            </p>
          </div>
        </div>

        {/* Patient Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-500 text-sm">
                Patient Name
              </p>

              <h2 className="font-semibold text-lg">
                {patient.pname}
              </h2>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Blood Group
              </p>

              <h2 className="font-semibold text-lg">
                {patient.blood}
              </h2>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Gender
              </p>

              <h2 className="font-semibold text-lg">
                {patient.gender}
              </h2>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-gray-500 text-sm mb-2">
              Room
            </p>

            <h2 className="text-3xl font-bold text-blue-600">
              {patient.id}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-gray-500 text-sm mb-2">
              Admitted On
            </p>

            <h2 className="text-xl font-bold">
              {patient.date}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-gray-500 text-sm mb-2">
              Medicines Given
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              {patient.medicines}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-gray-500 text-sm mb-2">
              Procedures Done
            </p>

            <h2 className="text-3xl font-bold text-purple-600">
              {patient.procedure}
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab("medicines")}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                activeTab === "medicines"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Medicines
            </button>

            <button
              onClick={() => setActiveTab("procedures")}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                activeTab === "procedures"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Procedures
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {activeTab === "overview" && (
            <Overview patient={patient} />
          )}

          {activeTab === "medicines" && (
            <Medicines />
          )}

          {activeTab === "procedures" && (
            <Procedure />
          )}
        </div>
      </div>
    </Layout>
  );
}