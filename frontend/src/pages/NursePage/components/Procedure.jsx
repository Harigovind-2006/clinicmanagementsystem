import React, { useState } from "react";

export default function Procedure() {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState("");
  const [procedures, setProcedures] = useState([]);

  const procedureMaster = [
    {
      name: "Blood Test",
      description: "Complete Blood Count (CBC)",
    },
    {
      name: "ECG",
      description: "Electrocardiogram",
    },
    {
      name: "X-Ray",
      description: "Chest X-Ray",
    },
    {
      name: "Ultrasound",
      description: "Abdominal Ultrasound",
    },
    {
      name: "MRI Scan",
      description: "Magnetic Resonance Imaging",
    },
    {
      name: "CT Scan",
      description: "Computed Tomography Scan",
    },
  ];

  const filteredProcedures = procedureMaster.filter((procedure) =>
    procedure.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProcedure = () => {
    if (!selectedProcedure) {
      alert("Please select a procedure");
      return;
    }

    const procedure = procedureMaster.find(
      (p) => p.name === selectedProcedure
    );

    setProcedures([
      ...procedures,
      {
        ...procedure,
        done: false,
      },
    ]);

    setSearch("");
    setSelectedProcedure("");
  };

  const markProcedureDone = (index) => {
    const updated = [...procedures];

    updated[index] = {
      ...updated[index],
      done: true,
    };

    setProcedures(updated);
  };

  const handleDelete = (index) => {
    setProcedures(
      procedures.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Add Procedure */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">
          Add Procedure
        </h2>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium mb-2">
              Procedure *
            </label>

            <input
              type="text"
              placeholder="Search procedure..."
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
                {filteredProcedures.length > 0 ? (
                  filteredProcedures.map((procedure) => (
                    <div
                      key={procedure.name}
                      onClick={() => {
                        setSelectedProcedure(
                          procedure.name
                        );
                        setSearch(procedure.name);
                        setShowDropdown(false);
                      }}
                      className="p-3 cursor-pointer hover:bg-gray-100"
                    >
                      <p className="font-medium">
                        {procedure.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {procedure.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500">
                    No procedure found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddProcedure}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
            >
              Add Procedure
            </button>

            <button
              onClick={() => {
                setSearch("");
                setSelectedProcedure("");
              }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Procedure List */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">
          Current Procedures
        </h2>

        {procedures.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No procedures added yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3">Procedure</th>
                  <th className="py-3">Description</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {procedures.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b"
                  >
                    <td className="py-4 font-medium">
                      {item.name}
                    </td>

                    <td className="text-gray-600">
                      {item.description}
                    </td>

                    <td>
                      {item.done ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm">
                          Done
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                          Pending
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="flex gap-2">
                        {!item.done && (
                          <button
                            onClick={() =>
                              markProcedureDone(index)
                            }
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                          >
                            Mark Done
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleDelete(index)
                          }
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </div>
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