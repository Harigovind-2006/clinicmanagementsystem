import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";

export default function PatientAssessment() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const [selectedVital, setSelectedVital] = useState("");
  const [customVitalName, setCustomVitalName] = useState("");
  const [vitals, setVitals] = useState([]);
  const [complaints, setComplaints] = useState("");
  const [observations, setObservations] = useState("");

  const vitalOptions = [
    "Blood Pressure",
    "Pulse Rate",
    "Temperature",
    "SpO2",
    "Weight",
    "Height",
    "Respiratory Rate",
    "Others",
  ];

  const addVital = () => {
    if (!selectedVital) return;

    const vitalName =
      selectedVital === "Others"
        ? customVitalName.trim()
        : selectedVital;

    if (!vitalName) return;

    setVitals((prev) => [
      ...prev,
      {
        name: vitalName,
        value: "",
      },
    ]);

    setSelectedVital("");
    setCustomVitalName("");
  };

  const updateVital = (index, value) => {
    const updatedVitals = [...vitals];
    updatedVitals[index].value = value;
    setVitals(updatedVitals);
  };

  const removeVital = (index) => {
    setVitals(vitals.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const assessmentData = {
      patient,
      vitals,
      complaints,
      observations,
    };

    console.log(assessmentData);
    alert("Assessment Saved Successfully");
  };

  if (!patient) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-red-600">
          Patient Not Found
        </h1>

        <p className="mt-2 text-gray-600">
          PID: {pid}
        </p>
      </div>
    );
  }

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 border rounded-lg bg-white"
            >
              ☰
            </button>

            <div>
              <button
                onClick={() => navigate(-1)}
                className="text-blue-600 mb-2"
              >
                ← Back
              </button>

              <h1 className="text-2xl md:text-3xl font-bold">
                Patient Assessment
              </h1>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
          >
            Save Assessment
          </button>
        </div>

        {/* Patient Information */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Patient Information
          </h2>

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
          </div>
        </div>

        {/* Vitals */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Vitals
          </h2>

          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <select
              value={selectedVital}
              onChange={(e) =>
                setSelectedVital(e.target.value)
              }
              className="border rounded-lg p-3 flex-1"
            >
              <option value="">
                Select Vital
              </option>

              {vitalOptions.map((vital) => (
                <option
                  key={vital}
                  value={vital}
                >
                  {vital}
                </option>
              ))}
            </select>

            <button
              onClick={addVital}
              className="bg-blue-600 text-white px-5 rounded-lg"
            >
              Add Vital
            </button>
          </div>

          {selectedVital === "Others" && (
            <input
              type="text"
              value={customVitalName}
              onChange={(e) =>
                setCustomVitalName(e.target.value)
              }
              placeholder="Enter custom vital name"
              className="w-full border rounded-lg p-3 mb-4"
            />
          )}

          <div className="space-y-3">
            {vitals.map((vital, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-3"
              >
                <input
                  value={vital.name}
                  readOnly
                  className="border rounded-lg p-3 bg-gray-50"
                />

                <input
                  value={vital.value}
                  onChange={(e) =>
                    updateVital(
                      index,
                      e.target.value
                    )
                  }
                  placeholder={`Enter ${vital.name}`}
                  className="border rounded-lg p-3"
                />

                <button
                  onClick={() =>
                    removeVital(index)
                  }
                  className="bg-red-100 text-red-600 rounded-lg px-4 py-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Complaints */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Patient Complaints
          </h2>

          <textarea
            rows={5}
            value={complaints}
            onChange={(e) =>
              setComplaints(e.target.value)
            }
            placeholder="Enter patient complaints..."
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Observations */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Clinical Observations
          </h2>

          <textarea
            rows={5}
            value={observations}
            onChange={(e) =>
              setObservations(e.target.value)
            }
            placeholder="Enter clinical observations..."
            className="w-full border rounded-lg p-3"
          />
        </div>
      </div>
    </Layout>
  );
}