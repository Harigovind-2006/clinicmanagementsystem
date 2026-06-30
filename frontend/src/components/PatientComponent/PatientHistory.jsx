import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import PatientVisitTabs from "./PatientVisitTabs";
import {
  Clock,
  Calendar,
  Stethoscope,
  FileText,
  Lock,
  CheckCircle2,
  Pill,
  User,
  Activity,
} from "lucide-react";
import api from "../../api/axios";

export default function PatientHistory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Use id from URL params (MongoDB _id)
  const { id } = useParams();

  // ✅ State for patient data
  const [patientData, setPatientData] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // Fetch role from local storage
  const storedRole = (localStorage.getItem("role") || "").toLowerCase();

  const isManager = storedRole === "manager";
  const isSeniorDoctor = storedRole === "seniordoctor"; // ✅ Fixed role check
  const canViewHistory = isManager || isSeniorDoctor;

  // ✅ Fetch patient and history data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch patient data
        const patientRes = await api.get(`/patientapi/${id}`);
        setPatientData(patientRes.data);

        // Fetch appointment history
        const historyRes = await api.get(`/appoinmentapi/history/${id}`);
        const appointments = historyRes.data.data || historyRes.data || [];

        // Sort by date (newest first)
        appointments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setHistory(appointments);

        // Set current appointment (most recent)
        if (appointments.length > 0) {
          setCurrentAppointment(appointments[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load patient history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ Handle save consultation
  const handleSaveConsultation = async () => {
    if (!currentAppointment) {
      alert("No current appointment found.");
      return;
    }

    try {
      await api.put(`/appoinmentapi/${currentAppointment._id}`, {
        sdObservations: consultationNotes,
      });

      alert("Consultation saved successfully.");

      // Refresh data
      const historyRes = await api.get(`/appoinmentapi/history/${id}`);
      const appointments = historyRes.data.data || historyRes.data || [];
      appointments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setHistory(appointments);
      if (appointments.length > 0) {
        setCurrentAppointment(appointments[0]);
      }
      setConsultationNotes("");
    } catch (error) {
      console.error("Error saving consultation:", error);
      setError("Failed to save consultation. Please try again.");
    }
  };

  // ✅ Loading screen
  if (loading) {
    return (
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading patient history...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold">Error</p>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // --- UNAUTHORIZED VIEW (FOS) ---
  if (!canViewHistory) {
    return (
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500 max-w-md">
            You do not have the required permissions to view confidential
            patient medical history. This area is restricted to Doctors and
            Managers.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col h-full min-h-screen">
        {/* Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 min-h-[40px]">
          <div className="flex items-center gap-2 sm:gap-3 text-sm flex-wrap">
            <Link
              to="/patients"
              className="text-blue-600 font-medium cursor-pointer hover:underline transition-colors"
            >
              Patients
            </Link>
            <span className="text-gray-400">{">"}</span>
            <Link
              to={`/patients/${id}`}
              className="text-gray-900 font-medium cursor-pointer hover:underline transition-colors"
            >
              {patientData?.name || "Unknown Patient"}
            </Link>
            <span className="text-gray-400">{">"}</span>
            <span className="text-gray-500">History</span>
          </div>
        </div>

        {/* --- Unified Tabs Component --- */}
        <PatientVisitTabs
          id={id} // ✅ Pass 'id', NOT 'pid'
          historyCount={history.length}
          activeTab="history"
        />

        {/* --- MANAGER VIEW --- */}
        {isManager && (
          <div className="max-w-4xl space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" /> Complete Historical
              Records
            </h3>

            {history.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                No past visits found for this patient.
              </div>
            ) : (
              history.map((visit) => (
                <div
                  key={visit._id || visit.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-sm transition-all hover:shadow-md"
                >
                  {/* Visit Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <span className="bg-blue-50 border border-blue-100 text-blue-700 font-bold px-4 py-1.5 rounded-lg text-sm">
                        Token #{visit.tokenNumber || "N/A"}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {visit.appointmentDate
                          ? new Date(visit.appointmentDate).toLocaleDateString()
                          : "N/A"}
                        <span className="text-gray-300">|</span>
                        <Clock className="w-4 h-4 text-gray-400" />
                        {visit.appointmentTime || "N/A"}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${
                        visit.status?.toLowerCase() === "completed"
                          ? "bg-green-50 border border-green-100 text-green-700"
                          : visit.status?.toLowerCase() === "waiting"
                            ? "bg-amber-50 border border-amber-100 text-amber-700"
                            : "bg-gray-50 border border-gray-100 text-gray-700"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                      {visit.status || "Unknown"}
                    </span>
                  </div>

                  {/* Visit Body */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Attending Doctor
                        </p>
                        <p className="font-semibold text-gray-900 text-base">
                          {visit.doctor?.name ||
                            visit.doctor?.fullname ||
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Specialization
                        </p>
                        <p className="font-medium text-gray-700">
                          {visit.specialization ||
                            visit.specialisation ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5" /> Observations
                        </p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                          {visit.jdObservations ||
                            visit.sdObservations ||
                            "No observations recorded"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" /> Consultation
                          Notes & Prescriptions
                        </p>
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-sm">
                          <p className="text-gray-800 font-medium mb-2">
                            {visit.sdObservations ||
                              visit.jdObservations ||
                              "No notes available"}
                          </p>
                          {visit.medicine && visit.medicine.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {visit.medicine.map((med, index) => (
                                <span
                                  key={index}
                                  className="bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-semibold"
                                >
                                  {med.medicine?.medicinename ||
                                    med.medicine ||
                                    "Unknown"}
                                  {med.days && ` (${med.days}d)`}
                                  {med.frequency && ` - ${med.frequency}`}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- SENIOR DOCTOR VIEW --- */}
        {isSeniorDoctor && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Patient History List */}
            <div className="lg:col-span-2 space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Past Visits (
                {history.length})
              </h3>

              {history.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                  No past visits found for this patient.
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  {history.map((visit, index) => (
                    <div
                      key={visit._id || visit.id}
                      className={`p-5 sm:p-6 ${index !== history.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="font-bold text-gray-900">
                          {visit.appointmentDate
                            ? new Date(
                                visit.appointmentDate,
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                        <span className="text-gray-400 text-sm">
                          •{" "}
                          {visit.doctor?.name ||
                            visit.doctor?.fullname ||
                            "N/A"}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ml-auto ${
                            visit.status?.toLowerCase() === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {visit.status || "Unknown"}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong className="text-gray-500 block mb-1">
                            Observations:
                          </strong>
                          <p className="text-gray-800">
                            {visit.jdObservations || "No observations"}
                          </p>
                        </div>
                        <div>
                          <strong className="text-gray-500 block mb-1">
                            Senior Notes:
                          </strong>
                          <p className="text-gray-800">
                            {visit.sdObservations || "No senior notes"}
                          </p>
                        </div>
                        {visit.medicine && visit.medicine.length > 0 && (
                          <div className="sm:col-span-2 mt-2">
                            <strong className="text-gray-500 block mb-2">
                              Prescriptions:
                            </strong>
                            <div className="flex flex-wrap gap-2">
                              {visit.medicine.map((med, i) => (
                                <span
                                  key={i}
                                  className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium"
                                >
                                  {med.medicine?.medicinename ||
                                    med.medicine ||
                                    "Unknown"}
                                  {med.days && ` (${med.days}d)`}
                                  {med.frequency && ` - ${med.frequency}`}
                                  {med.quantity && ` x${med.quantity}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Current Consultation Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-blue-200 rounded-2xl shadow-sm p-6 sticky top-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Current Consultation
                  </h3>
                </div>

                {/* Patient Info & Vitals */}
                <div className="mb-6 grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs uppercase font-bold block mb-0.5">
                      <User className="w-3 h-3 inline mr-1" /> Patient
                    </span>
                    <span className="font-semibold text-gray-900">
                      {patientData?.name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase font-bold block mb-0.5">
                      <Activity className="w-3 h-3 inline mr-1" /> BP
                    </span>
                    <span className="font-semibold text-gray-900">
                      {currentAppointment?.vitals?.BP || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase font-bold block mb-0.5">
                      Pulse
                    </span>
                    <span className="font-semibold text-gray-900">
                      {currentAppointment?.vitals?.Pulse || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase font-bold block mb-0.5">
                      Weight
                    </span>
                    <span className="font-semibold text-gray-900">
                      {currentAppointment?.vitals?.Weight || "N/A"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 text-xs uppercase font-bold block mb-0.5">
                      Consultation Fee
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{currentAppointment?.consultationFee || 0}
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Senior Doctor Notes & Prescriptions
                  </label>
                  <textarea
                    rows="6"
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    placeholder="Enter diagnosis, observations, and medicine prescriptions here..."
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
                  />
                </div>

                <button
                  onClick={handleSaveConsultation}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm"
                >
                  Save Consultation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
