import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import Medicines from "../NursePage/components/Medicines";
import Procedure from "../NursePage/components/Procedure";
import api from "../../api/axios";

export default function SeniorDoctorConsultation() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [consultation, setConsultation] = useState("");
  const [nurseInstructions, setNurseInstructions] = useState("");
  const [saved, setSaved] = useState(false);
  const [patientType, setPatientType] = useState("OP");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [medicinesAdded, setMedicinesAdded] = useState(true);
  const [proceduresAdded, setProceduresAdded] = useState(true);

  // Fetch appointment data on component mount
  useEffect(() => {
    if (id) {
      fetchAppointment();
    } else if (location.state) {
      // Fallback to location state if available
      setPatient(location.state);
      setLoading(false);
    } else {
      setErrorMsg("No patient data found");
      setLoading(false);
    }
  }, [id, location.state]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await api.get(`/appoinmentapi/${id}`);
      const appointment = res.data;
      
      console.log("Appointment Response:", appointment);

      // Convert vitals Map to normal object if needed
      const vitals =
        appointment.vitals instanceof Map
          ? Object.fromEntries(appointment.vitals)
          : appointment.vitals || {};

      // Option 1: Keep doctor as object
      const patientData = {
        _id: appointment._id,
        pid: appointment.patient?.pid || "N/A",
        pname: appointment.patient?.name || "Unknown",
        dob: appointment.patient?.dob 
          ? new Date(appointment.patient.dob).toLocaleDateString() 
          : "N/A",
        gender: appointment.patient?.gender || "N/A",
        blood: appointment.patient?.bloodGroup || "N/A",
        phone: appointment.patient?.mobilePhone || "N/A",

        token: appointment.tokenNumber,
        time: appointment.appointmentTime,
        date: appointment.appointmentDate 
          ? new Date(appointment.appointmentDate).toLocaleDateString() 
          : "N/A",

        // Store the FULL doctor object (includes fullname, specialisation, etc.)
        doctor: appointment.doctor || null,
        
        // Store specialization separately for easy access
        specialization: appointment.doctor?.specialisation || "N/A",

        complaints: appointment.complaints || "",
        observations: appointment.jdObservations || "",

        bp: vitals["Blood Pressure"] || "N/A",
        pulse: vitals["Pulse Rate"] || "N/A",
        temp: vitals["Temperature"] || "N/A",
        weight: vitals["Weight"] || "N/A",

        status: appointment.status || "scheduled",
        patientType: appointment.patientType || "OP",
      };

      setPatient(patientData);
      setPatientType(patientData.patientType === "ip" ? "IP" : "OP");
      
      setConsultation(appointment.sdObservations || "");
      setNurseInstructions(appointment.nurseNote || "");

    } catch (error) {
      console.error("Error fetching appointment:", error);
      setErrorMsg(error.response?.data?.message || "Failed to load patient data. Please try again.");
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!patient) {
      setErrorMsg("No patient data available");
      return;
    }

    if (!consultation.trim()) {
      setErrorMsg("Please complete the Consultation Notes field before saving.");
      return;
    }

    if (patientType === "IP") {
      if (!nurseInstructions.trim()) {
        setErrorMsg("Instructions to Nurse are mandatory for IP admissions.");
        return;
      }
    }

    try {
      const updateData = {
        sdObservations: consultation,
        nurseNote: nurseInstructions,
        status: "completed",
        patientType: patientType === "IP" ? "ip" : "op",
      };

      await api.put(`/appoinmentapi/${patient._id}`, updateData);

      setSaved(true);
      setErrorMsg("");
      setTimeout(() => {
        setSaved(false);
        navigate("/senior-dashboard");
      }, 2000);

    } catch (error) {
      console.error("Error saving consultation:", error);
      setErrorMsg(error.response?.data?.message || "Failed to save consultation. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading patient data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Patient not found
  if (!patient) {
    return (
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="p-10">
          <h1 className="text-2xl font-bold text-red-600">Patient Not Found</h1>
          <p className="mt-2 text-gray-600">Appointment ID: {id}</p>
          {errorMsg && <p className="mt-2 text-red-500">{errorMsg}</p>}
          <button
            onClick={() => navigate("/senior-dashboard")}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 font-medium hover:text-blue-800"
          >
            ← Back to Queue
          </button>
          <span className="text-gray-400">&gt;</span>
          <span className="font-medium text-gray-900">{patient.pname}</span>
          <span className="ml-auto text-sm text-gray-500">
            Token {patient.token ? `#${patient.token}` : "N/A"}
          </span>
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

        {/* Master Balanced Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6 items-stretch">
          
          {/* Column 1: Patient Information Card */}
          <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-6">Patient Information</h2>
              <div className="space-y-4">
                <InfoRow label="PID" value={patient.pid} />
                <InfoRow label="Name" value={patient.pname} />
                <InfoRow label="DOB" value={patient.dob} />
                <InfoRow label="Gender" value={patient.gender} />
                <InfoRow label="Blood Group" value={patient.blood} />
                <InfoRow label="Phone" value={patient.phone} />
                {/* FIXED: Use patient.doctor.fullname instead of patient.doctor */}
                <InfoRow label="Doctor" value={patient.doctor?.fullname || "N/A"} />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Type</span>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                      patientType === "IP"
                        ? "bg-purple-50 text-purple-700 border-purple-100"
                        : "bg-green-50 text-green-700 border-green-100"
                    }`}
                  >
                    {patientType}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                      patient.status === "completed"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-yellow-50 text-yellow-700 border-yellow-100"
                    }`}
                  >
                    {patient.status?.charAt(0).toUpperCase() + patient.status?.slice(1) || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setPatientType(patientType === "IP" ? "OP" : "IP")}
              className={`mt-6 w-full py-3 rounded-xl font-medium transition-colors ${
                patientType === "IP"
                  ? "border border-green-200 text-green-700 bg-white hover:bg-green-50/50"
                  : "border border-purple-200 text-purple-700 bg-white hover:bg-purple-50/50"
              }`}
            >
              {patientType === "IP" ? "Change To OP" : "Change To IP"}
            </button>
          </div>

          {/* Combined Column Matrix to Align Right Side Blocks */}
          <div className="xl:col-span-9 flex flex-col gap-6">
            
            {/* Vitals + Appointment Details Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Vitals Panel */}
              <div className="md:col-span-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex flex-col justify-between">
                <h2 className="text-xl font-semibold mb-4">Vitals</h2>
                <div className="grid grid-cols-2 gap-3 my-auto">
                  <VitalCard title="BP" value={patient.bp} />
                  <VitalCard title="Pulse" value={patient.pulse} />
                  <VitalCard title="Temperature" value={patient.temp} />
                  <VitalCard title="Weight" value={patient.weight} />
                </div>
              </div>

              {/* Appointment Details Panel */}
              <div className="md:col-span-4 bg-white rounded-2xl shadow-sm p-6 py-[29px] border border-gray-200 flex flex-col justify-between">
                <h2 className="text-xl font-semibold">Appointment Details</h2>
                <div className="space-y-4 my-auto">
                  <InfoRow label="Token" value={patient.token ? `#${patient.token}` : "N/A"} />
                  <InfoRow label="Time" value={patient.time} />
                  <InfoRow label="Date" value={patient.date} />
                  {/* FIXED: Use patient.specialization directly since we mapped it */}
                  <InfoRow label="Specialization" value={patient.specialization} />
                </div>
              </div>
            </div>

            {/* Extended-Width Clinical Complaints and Observations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex flex-col h-60">
                <h3 className="font-semibold text-lg mb-3 flex-shrink-0">
                  Patient Complaints
                </h3>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words overflow-y-auto flex-1 pr-1">
                  {patient.complaints || "No complaints recorded"}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex flex-col h-60">
                <h3 className="font-semibold text-lg mb-3 flex-shrink-0">
                  JD Observations
                </h3>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words overflow-y-auto flex-1 pr-1">
                  {patient.observations || "No observations recorded"}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Prescription and Procedures Sections */}
        <div className="space-y-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Prescription</h2>
              {patientType === "IP" && (
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">Optional for IP</span>
              )}
            </div>
            <Medicines isSeniorDoctor appointmentId={patient._id} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Procedures</h2>
              {patientType === "IP" && (
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">Optional for IP</span>
              )}
            </div>
            <Procedure isSeniorDoctor appointmentId={patient._id} />
          </div>
        </div>

        {/* Dynamic Consultation & Nursing Workspace */}
        <div className={`grid grid-cols-1 gap-6 mb-24 ${patientType === "IP" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Consultation Notes</h2>
            <textarea
              rows={6}
              value={consultation}
              onChange={(e) => setConsultation(e.target.value)}
              placeholder="Enter consultation notes..."
              className="w-full border border-gray-200 rounded-xl p-4 resize-none focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {patientType === "IP" && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-purple-900">
                Instructions to Nurse
              </h2>
              <textarea
                rows={6}
                value={nurseInstructions}
                onChange={(e) => setNurseInstructions(e.target.value)}
                placeholder="Enter mandatory nursing care instructions for IP admission..."
                className="w-full border border-gray-200 rounded-xl p-4 resize-none focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>
          )}
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-6 right-6 z-50 flex gap-3">
          {saved && (
            <div className="bg-green-600 text-white px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2">
              <span>✓</span> Changes Saved
            </div>
          )}
          <button
            onClick={handleSave}
            className={`px-8 py-3.5 rounded-xl shadow-lg text-white font-medium transition-all ${
              saved ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saved ? "✓ Changes Saved" : "Complete Consultation"}
          </button>
        </div>

      </div>
    </Layout>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value || "N/A"}</span>
    </div>
  );
}

function VitalCard({ title, value }) {
  return (
    <div className="bg-gray-50/60 rounded-xl p-4 border border-gray-100">
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{title}</p>
      <h3 className="font-semibold text-base mt-1 text-gray-800">{value || "N/A"}</h3>
    </div>
  );
}