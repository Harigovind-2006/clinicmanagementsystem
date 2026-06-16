import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function PatientAssessment() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const dummyPatients = [
    {
      pid: "P002",
      name: "Jane Smith",
      doctor: "Dr. Priya Verma",
      specialization: "General Medicine",
    },
    {
      pid: "P004",
      name: "Priya Nair",
      doctor: "Dr. Amit Sharma",
      specialization: "Cardiology",
    },
    {
      pid: "P005",
      name: "Suresh Rao",
      doctor: "Dr. Amit Sharma",
      specialization: "Cardiology",
    },
  ];

  const patient =
    location.state ||
    dummyPatients.find((p) => p.pid === pid);

  const [formData, setFormData] = useState({
    bp: "",
    pulse: "",
    temperature: "",
    spo2: "",
    complaints: "",
    observations: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log({
      patient,
      assessment: formData,
    });

    alert("Assessment Saved Successfully");
  };

  if (!patient) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-red-600">
          Patient Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        onClick={() => navigate("/junior-doctor")}
        className="mb-6 text-blue-600"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">
        Patient Assessment
      </h1>

      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Patient Information
        </h2>

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
      </div>

      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Vitals
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="bp"
            placeholder="Blood Pressure"
            value={formData.bp}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="pulse"
            placeholder="Pulse Rate"
            value={formData.pulse}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="temperature"
            placeholder="Temperature"
            value={formData.temperature}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            name="spo2"
            placeholder="SpO2"
            value={formData.spo2}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Patient Complaints
        </h2>

        <textarea
          rows="5"
          name="complaints"
          value={formData.complaints}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Clinical Observations
        </h2>

        <textarea
          rows="5"
          name="observations"
          value={formData.observations}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg"
      >
        Save Assessment
      </button>
    </div>
  );
}