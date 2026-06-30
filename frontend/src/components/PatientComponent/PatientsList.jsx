import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout";
import api from "../../api/axios";

export default function PatientsList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Added loading state
  const [error, setError] = useState(""); // ✅ Added error state

  useEffect(() => {
    // Fetch patients data from the API
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/patientapi/`);
        const data = response.data;
        // Handle different response structures
        setPatients(data.data || data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Failed to fetch patients. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // ✅ Filter logic for PID, Name, or Phone - with safer checks
  const filteredPatients = (patients || []).filter((patient) => {
    const query = searchQuery.toLowerCase();

    return (
      (patient.name || "").toLowerCase().includes(query) ||
      (patient.pid || "").toLowerCase().includes(query) ||
      (patient.mobilePhone || "").includes(query)
    );
  });

  // ✅ Loading screen
  if (loading) {
    return (
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading patients...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="w-full max-w-full block overflow-hidden bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-screen">
        {/* Header Section */}
        <div className="mb-6 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
            Patient Records
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 break-words">
            Manage and view all patient information
          </p>
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-2xl mb-6 overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Search by Patient Name, PID or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-4 text-gray-600 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* ✅ Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* SCROLLABLE TABLE CONTAINER */}
        <div className="w-full max-w-full block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="w-full block overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse table-auto">
              <thead className="bg-gray-50/70 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                    PID
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                    Type
                  </th>
                  <th className="p-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pr-6 w-32">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr
                      key={patient._id} // ✅ Changed from patient.pid to patient._id
                      className="hover:bg-gray-50/50 transition-colors whitespace-nowrap"
                    >
                      <td className="p-4 text-sm font-medium text-gray-900">
                        {patient.pid}
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-700">
                        {patient.name}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {patient.mobilePhone}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {/* ✅ Formatted gender */}
                        {patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1).toLowerCase() : "-"}
                      </td>
                      <td className="p-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            patient.patientType?.toLowerCase() === "op"
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : patient.patientType?.toLowerCase() === "ip"
                              ? "bg-green-50 text-green-700 border-green-100"
                              : "bg-gray-50 text-gray-700 border-gray-100"
                          }`}
                        >
                          {patient.patientType?.toLowerCase() === "op" 
                            ? "OP" 
                            : patient.patientType?.toLowerCase() === "ip" 
                            ? "IP" 
                            : patient.patientType?.toUpperCase() || "-"}
                        </span>
                      </td>
                      <td className="p-4 text-sm pr-6 text-right">
                        <Link
                          to={`/patients/${patient._id}`} // ✅ Changed from patient.pid to patient._id
                          className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-8 text-center text-sm text-gray-500"
                    >
                      {searchQuery 
                        ? `No patients found matching "${searchQuery}"` 
                        : "No patients found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ Patient count */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredPatients.length} of {(patients || []).length} patients
        </div>
      </div>
    </Layout>
  );
}