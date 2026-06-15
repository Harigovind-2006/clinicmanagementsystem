import React, { useState } from "react";


export default function Medicines() {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);
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

  function handleAddMedicine() {
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
      quantity,
      days,
      frequency,
      notes,
      given:false
    };

    setPrescriptions([...prescriptions, newPrescription]);

    setSearch("");
    setSelectedMedicine("");
    setQuantity(1);
    setDays("");
    setFrequency("");
    setNotes("");
  }

  function handleGiven(index) {
  const updated = [...prescriptions];

  updated[index] = {
    ...updated[index],
    given: true,
  };

  setPrescriptions(updated);
}
  
  return (
     <div>
    <div className="medicine-container">
      <h3>Add Medicine</h3>

      <label>Medicine *</label>

      <div className="searchable-dropdown">
        <input
          type="text"
          placeholder="Search medicine..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />

        {showDropdown && (
          <div className="dropdown-menu">
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((med) => (
                <div
                  key={med.name}
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedMedicine(med.name);
                    setSearch(med.name);
                    setShowDropdown(false);
                  }}
                >
                  <strong>{med.name}</strong>
                  <p>{med.scientificName}</p>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                No medicine found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="row">
        <div>
          <label>Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div>
          <label>Number of Days</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>
      </div>

      <label>Frequency / Instructions</label>
      <input
        type="text"
        placeholder="e.g. 1-0-1 after food"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
      />

      <label>Additional Notes</label>
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="button-group">
        <button className="add-btn" onClick={handleAddMedicine}>
          Add to Prescription
        </button>
      </div>

      {prescriptions.length > 0 && (
        <div className="prescription-list">
          <h3>Current Prescriptions</h3>

          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Scientific Name</th>
                <th>Qty</th>
                <th>Days</th>
                <th>Frequency</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {prescriptions.map((item, index) => (
                <tr key={index}>
                  <td>{item.medicine}</td>
                  <td>{item.scientificName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.days}</td>
                  <td>{item.frequency}</td>

                <td>
                  
  {item.given ? (
    <span className="status-given">Given</span>
  ) : (
    <span className="status-pending">Pending</span>
  )}
</td>
<td>
  <button
    className={item.given ? "given-btn done" : "given-btn"}
    onClick={() => handleGiven(index)}
    disabled={item.given}
  >
    {item.given ? "Given ✓" : "Mark Given"}
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