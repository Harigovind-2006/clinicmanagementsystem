import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import PatientVisitTabs from "./PatientVisitTabs"; // Import the unified component
import { Clock, Calendar, Stethoscope, FileText, Lock, CheckCircle2 } from "lucide-react";
import api from "../../api/axios";

export default function PatientHistory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState("");
  
  // Grab the PID / id from URL params
  const { pid, id } = useParams();
  const patientId = pid || id;

  const [patientData, setPatientData] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch role from local storage
  const storedRole = (localStorage.getItem("role") || "").toLowerCase();
  
  const isManager = storedRole === "manager";
  const isSeniorDoctor = storedRole === "senior doctor" || storedRole === "seniordoctor";
  const canViewHistory = isManager || isSeniorDoctor;

  useEffect(() => {
    const fetchPatientAndHistory = async () => {
      try {
        setLoading(true);
        
        // Fetch patient basic details
        const patientRes = await api.get(`/patientapi/${patientId}`);
        setPatientData(patientRes.data);

        // Fetch patient history/appointments
        const historyRes = await api.get(`/appoinmentapi/history/${patientId}`);
        const appointments = historyRes.data.data || historyRes.data || [];
        
        // Sort history by date/time (newest first)
        appointments.sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
        
        const formattedHistory = appointments.map((visit) => ({
          id: visit._id,
          token: visit.tokenNumber ? `#${visit.tokenNumber}` : "N/A",
          date: visit.appointmentDate ? new Date(visit.appointmentDate).toLocaleDateString() : "N/A",
          time: visit.appointmentTime || "N/A",
          doctor: visit.doctor?.fullname || "Unknown Doctor",
          specialization: visit.specialization || "N/A",
          observations: visit.jdObservations || "No observations recorded.",
          notes: visit.sdObservations || "No notes recorded.",
          prescriptions: visit.medicine?.map((med) => {
            const medName = med.medicine?.medicinename || "Unknown Medicine";
            return `${medName} (${med.frequency}, ${med.days} days)`;
          }) || [],
          status: visit.status ? visit.status.charAt(0).toUpperCase() + visit.status.slice(1) : "Completed",
          vitals: visit.vitals || {}
        }));

        setPatientHistory(formattedHistory);
      } catch (error) {
        console.error("Error fetching patient history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId && canViewHistory) {
      fetchPatientAndHistory();
    } else {
      setLoading(false);
    }
  }, [patientId, canViewHistory]);

  const latestVitals = patientHistory[0]?.vitals || {};
  const currentBP = latestVitals["Blood Pressure"] || "--";
  const currentPulse = latestVitals["Pulse Rate"] || "--";
  const currentWeight = latestVitals["Weight"] || "--";


  // --- UNAUTHORIZED VIEW (FOS) ---
  if (!canViewHistory) {
    return (
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 max-w-md">
            You do not have the required permissions to view confidential patient medical history. This area is restricted to Doctors and Managers.
          </p>
        </div>
      </Layout>
    );
  }

  // --- LOADING VIEW ---
  if (loading) {
    return (
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading patient history...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // --- NOT FOUND VIEW ---
  if (!patientData) {
    return (
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600">Patient Not Found</h1>
          <p className="mt-2 text-gray-600">Patient ID: {patientId}</p>
          <Link to="/patients" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            ← Back to Patients List
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col h-full min-h-screen">
        
        {/* Header & Breadcrumb - Aligned exactly with PatientDetails height/margins */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 min-h-[40px]">
          <div className="flex items-center gap-2 sm:gap-3 text-sm flex-wrap">
            <Link to="/patients" className="text-blue-600 font-medium cursor-pointer hover:underline transition-colors">
              Patients
            </Link>
            <span className="text-gray-400">{">"}</span>
            <Link to={`/patients/${patientId}`} className="text-gray-900 font-medium cursor-pointer hover:underline transition-colors" title='Back to Details'>
              {patientData.name}
            </Link>
          </div>
        </div>

        {/* --- Unified Tabs Component --- */}
        <PatientVisitTabs 
          pid={patientId} 
          historyCount={patientHistory.length} 
          activeTab="history" 
        />

        {/* --- MANAGER VIEW --- */}
        {isManager && (
          <div className="max-w-4xl space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" /> Complete Historical Records
            </h3>

            {patientHistory.map((visit) => (
              <div key={visit.id} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-sm transition-all hover:shadow-md">
                
                {/* Visit Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <span className="bg-blue-50 border border-blue-100 text-blue-700 font-bold px-4 py-1.5 rounded-lg text-sm">
                      Token {visit.token}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <Calendar className="w-4 h-4 text-gray-400" /> {visit.date}
                      <span className="text-gray-300">|</span>
                      <Clock className="w-4 h-4 text-gray-400" /> {visit.time}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {visit.status}
                  </span>
                </div>

                {/* Visit Body */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Attending Doctor</p>
                      <p className="font-semibold text-gray-900 text-base">{visit.doctor}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Specialization</p>
                      <p className="font-medium text-gray-700">{visit.specialization}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5" /> Observations
                      </p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">{visit.observations}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Consultation Notes & Prescriptions
                      </p>
                      <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-sm">
                        <p className="text-gray-800 font-medium mb-2">{visit.notes}</p>
                        <div className="flex flex-wrap gap-2">
                          {visit.prescriptions.map((item, index) => (
                            <span key={index} className="bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* --- SENIOR DOCTOR VIEW --- */}
        {isSeniorDoctor && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Patient History List */}
            <div className="lg:col-span-2 space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Past Visits ({patientHistory.length})
              </h3>

              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                {patientHistory.map((visit, index) => (
                  <div 
                    key={visit.id} 
                    className={`p-5 sm:p-6 ${index !== patientHistory.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="font-bold text-gray-900">{visit.date}</span>
                      <span className="text-gray-400 text-sm">• {visit.doctor}</span>
                      <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ml-auto">
                        {visit.status}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-gray-500 block mb-1">Observations:</strong>
                        <p className="text-gray-800">{visit.observations}</p>
                      </div>
                      <div>
                        <strong className="text-gray-500 block mb-1">Notes:</strong>
                        <p className="text-gray-800">{visit.notes}</p>
                      </div>
                      <div className="sm:col-span-2 mt-2">
                        <strong className="text-gray-500 block mb-2">Prescriptions:</strong>
                        <div className="flex flex-wrap gap-2">
                          {visit.prescriptions.map((item, i) => (
                            <span key={i} className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Current Consultation Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-blue-200 rounded-2xl shadow-sm p-6 sticky top-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Current Consultation</h3>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs uppercase font-bold block mb-0.5">Patient</span>
                    <span className="font-semibold text-gray-900">{patientData.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase font-bold block mb-0.5">Vitals (BP)</span>
                    <span className="font-semibold text-gray-900">{currentBP}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase font-bold block mb-0.5">Pulse</span>
                    <span className="font-semibold text-gray-900">{currentPulse}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase font-bold block mb-0.5">Weight</span>
                    <span className="font-semibold text-gray-900">{currentWeight}</span>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Consultation Notes & Prescriptions
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
                  onClick={() => alert("Consultation saved successfully.")}
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