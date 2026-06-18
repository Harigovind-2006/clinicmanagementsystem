import React, { useState, useRef, useEffect } from "react";
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

  const patient = location.state || dummyPatients.find((p) => p.pid === pid);

  const [searchVital, setSearchVital] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [vitals, setVitals] = useState([]);
  const [complaints, setComplaints] = useState("");
  const [observations, setObservations] = useState("");
  
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

  const handleSave = () => {
    if (vitals.length === 0) {
      alert("Please add at least one vital metric before saving.");
      return;
    }

    const emptyVitals = vitals.some((v) => !v.value.trim());
    if (emptyVitals) {
      alert("Please fill in values for all added vital rows.");
      return;
    }

    if (!complaints.trim()) {
      alert("Please complete the Patient Complaints entry field.");
      return;
    }

    if (!observations.trim()) {
      alert("Please complete the Clinical Observations entry field.");
      return;
    }

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
        <h1 className="text-2xl font-bold text-red-600">Patient Not Found</h1>
        <p className="mt-2 text-gray-600">PID: {pid}</p>
      </div>
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
              ===
            </button>

            <div>
              <button
                onClick={() => navigate(-1)}
                className="text-blue-600 mb-2 block"
              >
                &larr; Back
              </button>
              <h1 className="text-2xl md:text-3xl font-bold">
                Patient Assessment
              </h1>
            </div>
          </div>
        </div>

        {/* 4 Box Grid Layout (2 per row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Row 1 - Box 1: Patient Information */}
          <div className="bg-white rounded-xl shadow p-6 h-[400px] border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              Patient Information
            </h2>
            <div className="space-y-2">
              <p><strong>PID:</strong> {patient.pid}</p>
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>Doctor:</strong> {patient.doctor}</p>
              <p><strong>Specialization:</strong> {patient.specialization}</p>
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
                  placeholder="Select Vital"
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
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none"
                />
                
                {dropdownOpen && (
                  <ul className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-30 divide-y divide-gray-100">
                    {filteredVitalOptions.map((option) => (
                      <li
                        key={option}
                        onClick={() => handleSelectVital(option)}
                        className="p-3 text-sm hover:bg-gray-50 cursor-pointer text-gray-700"
                      >
                        {option}
                      </li>
                    ))}
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
                <div key={vital.name + index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={vital.name}
                    readOnly
                    className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-600"
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
                    className="border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => removeVital(index)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 rounded-lg px-4 py-2 text-sm transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
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
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
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
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
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