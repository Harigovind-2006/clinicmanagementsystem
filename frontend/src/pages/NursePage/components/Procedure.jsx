import React, { useState } from "react";

export default function Procedure({ role = "doctor" }) {
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

  function handleAddProcedure() {
    if (!selectedProcedure) {
      alert("Please select a procedure");
      return;
    }

    const procedure = procedureMaster.find(
      (p) => p.name === selectedProcedure
    );

    const newProcedure = {
      ...procedure,
      done: false,
    };

    setProcedures([...procedures, newProcedure]);

    setSearch("");
    setSelectedProcedure("");
  }

  function markProcedureDone(index) {
    const updated = [...procedures];

    updated[index] = {
      ...updated[index],
      done: true,
    };

    setProcedures(updated);
  }

  function handleDelete(index) {
    const updated = procedures.filter((_, i) => i !== index);
    setProcedures(updated);
  }

  return (
    <div className="procedure-page">
      {/* Doctor Only */}
      {role === "doctor" && (
        <div className="procedure-container">
          <h3>Add Procedure</h3>

          <label>Procedure *</label>

          <div className="searchable-dropdown">
            <input
              type="text"
              placeholder="Search procedure..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />

            {showDropdown && (
              <div className="dropdown-menu">
                {filteredProcedures.length > 0 ? (
                  filteredProcedures.map((procedure) => (
                    <div
                      key={procedure.name}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedProcedure(procedure.name);
                        setSearch(procedure.name);
                        setShowDropdown(false);
                      }}
                    >
                      <strong>{procedure.name}</strong>
                      <p>{procedure.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item">
                    No procedure found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="button-group">
            <button
              className="add-btn"
              onClick={handleAddProcedure}
            >
              Add Procedure
            </button>

            <button
              className="cancel-btn"
              onClick={() => {
                setSearch("");
                setSelectedProcedure("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Common Procedure List */}
      <div className="procedure-list">
        <h3>Current Procedures</h3>

        {procedures.length === 0 ? (
          <p className="empty-text">
            No procedures added yet
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Procedure</th>
                <th>Description</th>

                {role === "nurse" && <th>Status</th>}

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {procedures.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>

                  {role === "nurse" && (
                    <td>
                      {item.done ? (
                        <span className="status-given">
                          Done
                        </span>
                      ) : (
                        <span className="status-pending">
                          Pending
                        </span>
                      )}
                    </td>
                  )}

                  <td>
                    {role === "doctor" && (
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    )}

                    {role === "nurse" && (
                      <button
                        className={
                          item.done
                            ? "given-btn done"
                            : "given-btn"
                        }
                        onClick={() =>
                          markProcedureDone(index)
                        }
                        disabled={item.done}
                      >
                        {item.done
                          ? "Done ✓"
                          : "Mark as Done"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}