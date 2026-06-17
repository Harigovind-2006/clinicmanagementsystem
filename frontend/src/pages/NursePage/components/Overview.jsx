import React from "react";

export default function Overview({ patient, setPatient }) {
  function handleDischarge() {
    setPatient({
      ...patient,
      type: "OP",
    });
  }
  return (
    <div className="content-grid">
      <div className="profile-card">
        <h2>Patient Profile</h2>
        <p>PID: {patient.pid}</p>
        <p>Name: {patient.pname}</p>
        <p>Gender: {patient.gender}</p>
        <p>Blood Group: {patient.blood}</p>
        <p>Type:{patient.type}</p>
        {patient.type === "IP" && (
          <button onClick={handleDischarge} className="discharge-btn">
            Discharge
          </button>
        )}
      </div>

      <div className="notes-card">
        <h2>Doctor Notes</h2>
        <p>Dr. Amit Sharma</p>
        <p>Patient recovering well.</p>
      </div>
      <div className="vitals-card">
        <h2>Vitals</h2>

        <div className="vitals-grid">
          <div className="vital-box">
            <p>BP</p>
            <h3>120/80</h3>
          </div>

          <div className="vital-box">
            <p>Pulse</p>
            <h3>72 bpm</h3>
          </div>

          <div className="vital-box">
            <p>Temp</p>
            <h3>98.6°F</h3>
          </div>

          <div className="vital-box">
            <p>Weight</p>
            <h3>75 kg</h3>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="right-column">
        <div className="notes-card">
          <h2>Consultation Notes</h2>
          <p>Patient recovering well.</p>
        </div>

        <div className="notes-card">
          <h2>Observations</h2>
          <p>Patient is stable and responding well.</p>
        </div>
      </div>
    </div>
  );
}
