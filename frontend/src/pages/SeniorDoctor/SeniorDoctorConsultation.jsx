import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import Medicines from "../NursePage/components/Medicines";
import Procedure from "../NursePage/components/Procedure";

export default function SeniorDoctorConsultation() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [consultation, setConsultation] = useState("");
  const [nurseInstructions, setNurseInstructions] = useState("");
  const [saved, setSaved] = useState(false);
  const [patientType, setPatientType] = useState("OP");

  const [medicinesAdded, setMedicinesAdded] = useState(true); 
  const [proceduresAdded, setProceduresAdded] = useState(true);

  const patient = location.state || {
    pid: "P005",
    pname: "Suresh Rao",
    dob: "12/05/1995",
    gender: "Male",
    blood: "AB+",
    phone: "9876543210",
    bp: "120/80",
    pulse: "72 bpm",
    temp: "98.6°F",
    weight: "75 kg",
    observations: "Patient is responding well to treatment. Vital signs are steady with normal parameters maintained over a 24-hour cycle. Cardiovascular sounds are normal; no peripheral edema noted. Continued tracking is advised.",
    complaints: "Patient presents with recurrent sub-sternal chest tightness radiating slightly to the left shoulder, primarily brought on by physical exertion over the last 3 weeks. Reports experiencing progressive generalized fatigue, frequent unprovoked morning lethargy, and dynamic lightheadedness upon standing quickly from a recumbent posture. Notes intermittent nocturnal dyspnea and minor sleep disruptions.",
    token: "4",
    time: "11:00 AM",
    date: "21/06/2026",
  };

  const handleSave = () => {
    if (!consultation.trim()) {
      alert("Please complete the Consultation Notes field before saving.");
      return;
    }

    if (patientType === "IP") {
      if (!nurseInstructions.trim()) {
        alert("Instructions to Nurse are mandatory for IP admissions.");
        return;
      }
    } else {
      if (!medicinesAdded || !proceduresAdded) {
        alert("Please ensure both Medicines and Procedures are filled out for Outpatients.");
        return;
      }
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 font-medium hover:text-blue-800"
          >
            Back to Queue
          </button>
          <span className="text-gray-400">&gt;</span>
          <span className="font-medium text-gray-900">{patient.pname}</span>
        </div>

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
                  <InfoRow label="Token" value={`#${patient.token}`} />
                  <InfoRow label="Time" value={patient.time} />
                  <InfoRow label="Date" value={patient.date} />
                  <InfoRow label="Specialization" value="Cardiology" />
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
                  {patient.complaints}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex flex-col h-60">
                <h3 className="font-semibold text-lg mb-3 flex-shrink-0">
                  JD Observations
                </h3>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words overflow-y-auto flex-1 pr-1">
                  {patient.observations}
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
            <Medicines isSeniorDoctor />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Procedures</h2>
              {patientType === "IP" && (
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">Optional for IP</span>
              )}
            </div>
            <Procedure isSeniorDoctor />
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
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleSave}
            className={`px-8 py-3.5 rounded-xl shadow-lg text-white font-medium transition-all ${
              saved ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saved ? "✓ Changes Saved" : "Save Consultation"}
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
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function VitalCard({ title, value }) {
  return (
    <div className="bg-gray-50/60 rounded-xl p-4 border border-gray-100">
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{title}</p>
      <h3 className="font-semibold text-base mt-1 text-gray-800">{value}</h3>
    </div>
  );
}