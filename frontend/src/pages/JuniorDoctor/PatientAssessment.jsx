import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import api from "../../api/axios";

export default function PatientAssessment() {
  const { pid } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchVital, setSearchVital] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [vitals, setVitals] = useState([]);
  const [complaints, setComplaints] = useState("");
  const [observations, setObservations] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const dropdownRef = useRef(null);
  const vitalsInputRefs = useRef({});

  const vitalOptions = [
    "Blood Pressure",
    "Pulse Rate",
    "Temperature",
    "SpO2",
    "Weight",
    "Height",
    "Respiratory Rate",
  ];

  // Fetch appointment on component mount
  useEffect(() => {
    fetchAppointment();
  }, [pid]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await api.get(`/appoinmentapi/${pid}`);
      const appointment = res.data;

      setPatient(appointment);

      // Load saved vitals if they exist
      if (appointment.vitals && typeof appointment.vitals === 'object') {
        // Check if vitals is a Map or plain object
        const vitalsArray = Object.entries(appointment.vitals).map(
          ([name, value]) => ({
            name,
            value: value || "",
          })
        );
        setVitals(vitalsArray);
      } else {
        setVitals([]);
      }

      // Load saved complaints
      setComplaints(appointment.complaints || "");

      // Load saved observations (jdObservations from backend)
      setObservations(appointment.jdObservations || "");

    } catch (error) {
      console.error("Error fetching appointment:", error);
      setPatient(null);
      setErrorMsg("Failed to load patient data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredVitalOptions = vitalOptions.filter((option) =>
    option.toLowerCase().includes(searchVital.toLowerCase())
  );

  const handleSelectVital = (vitalName) => {
    if (!vitals.some((v) => v.name === vitalName)) {
      setVitals((prev) => [{ name: vitalName, value: "" }, ...prev]);
      
      setTimeout(() => {
        if (vitalsInputRefs.current[vitalName]) {
          vitalsInputRefs.current[vitalName].focus();
        }
      }, 50);
    }
    setSearchVital("");
    setDropdownOpen(false);
  };

  const handleAddCustomOrTypedVital = () => {
    const cleanInput = searchVital.trim();
    if (!cleanInput) return;

    const exactMatch = vitalOptions.find(
      (option) => option.toLowerCase() === cleanInput.toLowerCase()
    );

    const vitalNameToAdd = exactMatch ? exactMatch : cleanInput;

    if (!vitals.some((v) => v.name.toLowerCase() === vitalNameToAdd.toLowerCase())) {
      setVitals((prev) => [{ name: vitalNameToAdd, value: "" }, ...prev]);
      
      setTimeout(() => {
        if (vitalsInputRefs.current[vitalNameToAdd]) {
          vitalsInputRefs.current[vitalNameToAdd].focus();
        }
      }, 50);
    }
    
    setSearchVital("");
    setDropdownOpen(false);
  };

  const updateVital = (index, value) => {
    const updatedVitals = [...vitals];
    updatedVitals[index].value = value;
    setVitals(updatedVitals);
  };

  const removeVital = (index) => {
    setVitals(vitals.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // Clear previous error
    setErrorMsg("");

    // Validation
    if (vitals.length === 0) {
      setErrorMsg("Please add at least one vital metric before saving.");
      return;
    }

    const emptyVitals = vitals.some((v) => !v.value.trim());
    if (emptyVitals) {
      setErrorMsg("Please fill in values for all added vital rows.");
      return;
    }

    if (!complaints.trim()) {
      setErrorMsg("Please complete the Patient Complaints entry field.");
      return;
    }

    if (!observations.trim()) {
      setErrorMsg("Please complete the Clinical Observations entry field.");
      return;
    }

    try {
      // Convert vitals array to object for storage
      const vitalsObject = {};
      vitals.forEach((v) => {
        vitalsObject[v.name] = v.value;
      });

      const newStatus = patient.status === "scheduled" ? "waiting" : patient.status;

      await api.put(`/appoinmentapi/${patient._id}`, {
        vitals: vitalsObject,
        jdObservations: observations,
        complaints: complaints,
        status: newStatus, // Moves to "Waiting/Submitted" tab
      });

      alert("Assessment saved successfully.");
      navigate("/junior-doctor");
    } catch (error) {
      console.error("Error saving assessment:", error);
      setErrorMsg(error.response?.data?.message || "Unable to save assessment. Please try again.");
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
          <p className="mt-2 text-gray-600">Appointment ID: {pid}</p>
          {errorMsg && <p className="mt-2 text-red-500">{errorMsg}</p>}
          <button
            onClick={() => navigate("/junior-doctor")}
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
      <div className="p-4 md:p-8 min-h-screen pb-24 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 border border-gray-200 rounded-lg bg-white"
            >
              ☰
            </button>

            <div>
              <button
                onClick={() => navigate(-1)}
                className="text-blue-600 mb-2 block hover:text-blue-800"
              >
                ← Back
              </button>
              <h1 className="text-2xl md:text-3xl font-bold">
                Patient Assessment
              </h1>
              {patient.status === "scheduled" && (
                <p className="text-sm text-green-600 mt-1">
                  ⚡ Previously assessed - Review and update if needed
                </p>
              )}
            </div>
          </div>
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

        {/* 4 Box Grid Layout (2 per row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Row 1 - Box 1: Patient Information */}
          <div className="bg-white rounded-xl shadow p-6 h-[400px] border border-gray-200 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              Patient Information
            </h2>
            <div className="space-y-2">
              <p><strong>PID:</strong> {patient.patient?.pid || "N/A"}</p>
              <p><strong>Name:</strong> {patient.patient?.name || "Unknown"}</p>
              <p><strong>Doctor:</strong> {patient.doctor?.fullname || "N/A"}</p>
              <p><strong>Specialization:</strong> {patient.doctor?.specialization || "N/A"}</p>
              <p><strong>Token:</strong> #{patient.tokenNumber || "N/A"}</p>
              <p><strong>Date:</strong> {patient.appointmentDate ? new Date(patient.appointmentDate).toLocaleDateString() : "N/A"}</p>
              <p><strong>Time:</strong> {patient.appointmentTime || "N/A"}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  patient.status === "waiting" 
                    ? "bg-yellow-100 text-yellow-700" 
                    : patient.status === "scheduled"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {patient.status?.charAt(0).toUpperCase() + patient.status?.slice(1) || "N/A"}
                </span>
              </p>
            </div>
          </div>

          {/* Row 1 - Box 2: Vitals Module (Fixed Outside Height Frame with Internal Scrolling) */}
          <div className="bg-white rounded-xl shadow p-6 h-[400px] flex flex-col border border-gray-200" ref={dropdownRef}>
            <h2 className="text-xl font-semibold mb-4 flex-shrink-0">
              Vitals
            </h2>

            <div className="flex gap-3 mb-4 relative flex-shrink-0">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search and select vital..."
                  value={searchVital}
                  onFocus={() => setDropdownOpen(true)}
                  onChange={(e) => {
                    setSearchVital(e.target.value);
                    setDropdownOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddCustomOrTypedVital();
                    }
                  }}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                
                {dropdownOpen && (
                  <ul className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-30 divide-y divide-gray-100">
                    {filteredVitalOptions.length > 0 ? (
                      filteredVitalOptions.map((option) => (
                        <li
                          key={option}
                          onClick={() => handleSelectVital(option)}
                          className="p-3 text-sm hover:bg-gray-50 cursor-pointer text-gray-700"
                        >
                          {option}
                        </li>
                      ))
                    ) : (
                      <li className="p-3 text-sm text-gray-400 text-center">
                        No matching vitals found
                      </li>
                    )}
                    {searchVital.trim() !== "" && !vitalOptions.some(o => o.toLowerCase() === searchVital.toLowerCase()) && (
                      <li
                        onClick={handleAddCustomOrTypedVital}
                        className="p-3 text-sm hover:bg-gray-50 cursor-pointer text-blue-600 font-medium bg-blue-50/30"
                      >
                        Add Custom: "{searchVital}"
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {searchVital.trim() !== "" && (
                <button
                  onClick={handleAddCustomOrTypedVital}
                  className="bg-blue-600 text-white px-5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Add
                </button>
              )}
            </div>

            {/* Scrollable Container Window for Active Vitals Stack */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-3">
              {vitals.map((vital, index) => (
                <div key={vital.name + index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  <input
                    value={vital.name}
                    readOnly
                    className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-600 text-sm"
                  />
                  <input
                    ref={(el) => (vitalsInputRefs.current[vital.name] = el)}
                    value={vital.value}
                    onChange={(e) => updateVital(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSave();
                      }
                    }}
                    placeholder={`Enter ${vital.name}`}
                    className="border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeVital(index)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 rounded-lg px-4 py-2 text-sm transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {vitals.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">
                    No vitals added yet.
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Search and add above.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Row 2 - Box 3: Patient Complaints */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              Patient Complaints
            </h2>
            <textarea
              rows={5}
              value={complaints}
              onChange={(e) => setComplaints(e.target.value)}
              placeholder="Enter patient complaints..."
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Row 2 - Box 4: Clinical Observations */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              Clinical Observations
            </h2>
            <textarea
              rows={5}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Enter clinical observations..."
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

        </div>
      </div>

      {/* Floating Save Button */}
      <button
        onClick={handleSave}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-lg shadow-lg z-50 font-medium transition"
      >
        Save Assessment
      </button>
    </Layout>
  );
} 