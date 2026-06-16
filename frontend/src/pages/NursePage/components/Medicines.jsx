import React, { useState } from "react";

export default function Medicines() {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  
  const [days, setDays] = useState("");
  const [frequency, setFrequency] = useState("");
  const [notes, setNotes] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);

  const medicineMaster = [
    {
      name: "Paracetamol",
      scientificName: "Acetaminophen",
    },
    {
      name: "Augmentin",
      scientificName: "Amoxicillin + Clavulanic Acid",
    },
    {
      name: "Azithral",
      scientificName: "Azithromycin",
    },
    {
      name: "Crocin",
      scientificName: "Acetaminophen",
    },
    {
      name: "Metformin",
      scientificName: "Metformin Hydrochloride",
    },
    {
      name: "Aspirin",
      scientificName: "Acetylsalicylic Acid",
    },
  ];

  const filteredMedicines = medicineMaster.filter((med) =>
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMedicine = () => {
    if (!selectedMedicine) {
      alert("Please select a medicine");
      return;
    }

    const medicine = medicineMaster.find(
      (med) => med.name === selectedMedicine
    );

    const newPrescription = {
      medicine: medicine.name,
      scientificName: medicine.scientificName,
      
      days,
      frequency,
      notes,
      given: false,
    };

    setPrescriptions([...prescriptions, newPrescription]);

    setSearch("");
    setSelectedMedicine("");
    
    setDays("");
    setFrequency("");
    setNotes("");
  };

  const handleGiven = (index) => {
    const updated = [...prescriptions];

    updated[index] = {
      ...updated[index],
      given: true,
    };

    setPrescriptions(updated);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Add Medicine */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">
          Add Medicine
        </h2>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium mb-2">
              Medicine *
            </label>

            <input
              type="text"
              placeholder="Search medicine..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full border rounded-xl p-3"
            />

            {showDropdown && (
              <div className="absolute z-20 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredMedicines.length > 0 ? (
                  filteredMedicines.map((med) => (
                    <div
                      key={med.name}
                      onClick={() => {
                        setSelectedMedicine(med.name);
                        setSearch(med.name);
                        setShowDropdown(false);
                      }}
                      className="p-3 cursor-pointer hover:bg-gray-100"
                    >
                      <p className="font-medium">
                        {med.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {med.scientificName}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500">
                    No medicine found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Days
              </label>

              <input
                type="number"
                value={days}
                onChange={(e) =>
                  setDays(e.target.value)
                }
                className="w-full border rounded-xl p-3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Frequency / Instructions
            </label>

            <input
              type="text"
              placeholder="1-0-1 after food"
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value)
              }
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Notes
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              className="w-full border rounded-xl p-3"
            />
          </div>

          <button
            onClick={handleAddMedicine}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
          >
            Add To Prescription
          </button>
        </div>
      </div>

      {/* Prescription Table */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">
          Current Prescriptions
        </h2>

        {prescriptions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No prescriptions added yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3">Medicine</th>
                  <th className="py-3">Qty</th>
                  <th className="py-3">Days</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {prescriptions.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b"
                  >
                    <td className="py-4">
                      <div>
                        <p className="font-medium">
                          {item.medicine}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.scientificName}
                        </p>
                      </div>
                    </td>

                    <td>{item.quantity}</td>

                    <td>{item.days}</td>

                    <td>
                      {item.given ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm">
                          Given
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                          Pending
                        </span>
                      )}
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          handleGiven(index)
                        }
                        disabled={item.given}
                        className={`px-4 py-2 rounded-lg text-white ${
                          item.given
                            ? "bg-green-600 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {item.given
                          ? "Given ✓"
                          : "Mark Given"}
                      </button>
                    </td>
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