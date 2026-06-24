import React, { useState, useEffect, useRef } from "react";

export default function Medicines({ isSeniorDoctor = false }) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState("");

  const [days, setDays] = useState("");
  const [frequency, setFrequency] = useState("");

  const [prescriptions, setPrescriptions] = useState([]);
  const dropdownRef = useRef(null);

  const medicineMaster = [
    { name: "Paracetamol", scientificName: "Acetaminophen" },
    { name: "Augmentin", scientificName: "Amoxicillin + Clavulanic Acid" },
    { name: "Azithral", scientificName: "Azithromycin" },
    { name: "Crocin", scientificName: "Acetaminophen" },
    { name: "Metformin", scientificName: "Metformin Hydrochloride" },
    { name: "Aspirin", scientificName: "Acetylsalicylic Acid" },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMedicines = medicineMaster.filter((med) =>
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMedicine = () => {
    if (!selectedMedicine) {
      alert("Please select a medicine from the dropdown list.");
      return;
    }

    const parsedDays = parseInt(days, 10);
    if (!days || isNaN(parsedDays) || parsedDays <= 0) {
      alert("Please enter a valid number of days (1 or more).");
      return;
    }

    if (!frequency.trim()) {
      alert("Please specify the frequency or instructions.");
      return;
    }

    const medicine = medicineMaster.find((med) => med.name === selectedMedicine);

    // Latest prescription is prepended to show at the top of the table list
    setPrescriptions([
      {
        medicine: medicine.name,
        scientificName: medicine.scientificName,
        days: parsedDays,
        frequency: frequency.trim(),
        given: false,
      },
      ...prescriptions,
    ]);

    // Reset entry controls safely
    setSearch("");
    setSelectedMedicine("");
    setDays("");
    setFrequency("");
  };

  const handleGiven = (index) => {
    const updated = [...prescriptions];
    updated[index] = { ...updated[index], given: true };
    setPrescriptions(updated);
  };

  const handleDelete = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      {/* Add Medicine Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Add Medicine</h2>

          <div className="space-y-4">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicine *</label>
              <input
                type="text"
                placeholder="Search medicine..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
              />

              {showDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((med) => (
                      <div
                        key={med.name}
                        onClick={() => {
                          setSelectedMedicine(med.name);
                          setSearch(med.name);
                          setShowDropdown(false);
                        }}
                        className="p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50 last:border-none"
                      >
                        <p className="font-medium text-sm text-gray-800">{med.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{med.scientificName}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-gray-400 text-center">No medicine found</div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days *</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 5"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
              <input
                type="text"
                placeholder="e.g. 1-0-1"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleAddMedicine}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors mt-6 text-sm"
        >
          Add To Prescription
        </button>
      </div>

      {/* Current Prescription View - Scrollable list handling container setup */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Current Prescriptions</h2>

        {prescriptions.length === 0 ? (
          <div className="text-center my-auto py-12 text-gray-400 text-sm">
            No prescriptions added yet
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[335px] pr-1 flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-400 sticky top-0 bg-white z-10">
                  <th className="pb-3">Medicine</th>
                  <th className="pb-3 px-2">Days</th>
                  <th className="pb-3">Frequency</th>
                  {isSeniorDoctor ? (
                    <th className="pb-3 text-right">Action</th>
                  ) : (
                    <>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {prescriptions.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/40 transition-colors">
                    <td className="py-3.5 pr-2">
                      <p className="font-medium text-gray-900">{item.medicine}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.scientificName}</p>
                    </td>
                    <td className="py-3.5 px-2 font-medium">{item.days}</td>
                    <td className="py-3.5 font-medium">{item.frequency}</td>

                    {isSeniorDoctor ? (
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDelete(index)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    ) : (
                      <>
                        <td className="py-3.5">
                          {item.given ? (
                            <span className="inline-flex px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                              Given
                            </span>
                          ) : (
                            <span className="inline-flex px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 text-right">
                          {!item.given ? (
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => handleGiven(index)}
                                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs transition-colors"
                              >
                                Mark Given
                              </button>
                              <button
                                onClick={() => handleDelete(index)}
                                className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium rounded-lg text-xs transition-colors border border-gray-200"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-green-600 font-medium pr-2">Given ✓</span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}