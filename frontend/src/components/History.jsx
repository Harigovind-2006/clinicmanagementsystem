import React, { useState } from "react";

export default function PatientHistory() {
  const [role, setRole] = useState("manager");

  const patientHistory = [
    {
      id: 1,
      token: "#0",
      date: "2026-05-20",
      time: "09:00 AM",
      doctor: "Dr. Amit Sharma",
      specialization: "Cardiology",
      observations: "Mild chest discomfort, advised rest.",
      notes:
        "Prescribed Atorvastatin 10mg. Follow up in 3 weeks.",
      prescriptions: ["Atorvastatin x30"],
      status: "Completed",
    },
    {
      id: 2,
      token: "#1",
      date: "2026-06-19",
      time: "09:00 AM",
      doctor: "Dr. John Doe",
      specialization: "Cardiology",
      observations:
        "Patient complains of chest pain and shortness of breath.",
      notes:
        "ECG suggested. Continue medication and review after test.",
      prescriptions: ["ECG", "Atorvastatin 10mg"],
      status: "Completed",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Patient History</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setRole("manager")}
          style={{ marginRight: "10px" }}
        >
          Manager View
        </button>

        <button
          onClick={() => setRole("seniorDoctor")}
        >
          Senior Doctor View
        </button>
      </div>

      {/* MANAGER VIEW */}

      {role === "manager" && (
        <div>
          <h3>Manager History</h3>

          {patientHistory.map((visit) => (
            <div
              key={visit.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <span
                    style={{
                      background: "#e8f0ff",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      marginRight: "10px",
                    }}
                  >
                    Token {visit.token}
                  </span>

                  <span>
                    {visit.date} at {visit.time}
                  </span>
                </div>

                <span>{visit.status}</span>
              </div>

              <hr />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginTop: "15px",
                }}
              >
                <div>
                  <p>
                    <strong>Doctor</strong>
                  </p>
                  <p>{visit.doctor}</p>
                </div>

                <div>
                  <p>
                    <strong>Specialization</strong>
                  </p>
                  <p>{visit.specialization}</p>
                </div>
              </div>

              <div style={{ marginTop: "15px" }}>
                <p>
                  <strong>Observations</strong>
                </p>
                <p>{visit.observations}</p>
              </div>

              <div style={{ marginTop: "15px" }}>
                <p>
                  <strong>Consultation Notes</strong>
                </p>
                <p>{visit.notes}</p>
              </div>

              <div style={{ marginTop: "15px" }}>
                <p>
                  <strong>Prescriptions</strong>
                </p>

                <ul>
                  {visit.prescriptions.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SENIOR DOCTOR VIEW */}

      {role === "seniorDoctor" && (
        <div>
          <h3>
            Patient History (
            {patientHistory.length} previous visit(s))
          </h3>

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
            }}
          >
            {patientHistory.map((visit) => (
              <div
                key={visit.id}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "10px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <strong>{visit.date}</strong>

                  <span
                    style={{
                      background: "#f1f5f9",
                      padding: "4px 10px",
                      borderRadius: "12px",
                    }}
                  >
                    {visit.status}
                  </span>
                </div>

                <p>
                  <strong>Obs:</strong>{" "}
                  {visit.observations}
                </p>

                <p>
                  <strong>Notes:</strong>{" "}
                  {visit.notes}
                </p>

                <p>
                  <strong>Rx:</strong>{" "}
                  {visit.prescriptions.join(", ")}
                </p>
              </div>
            ))}
          </div>

          {/* Current Consultation Area */}

          <div
            style={{
              marginTop: "30px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <h3>Current Consultation</h3>

            <p>
              <strong>Patient:</strong> John Doe
            </p>

            <p>
              <strong>BP:</strong> 120/80
            </p>

            <p>
              <strong>Pulse:</strong> 72 bpm
            </p>

            <p>
              <strong>Weight:</strong> 75 kg
            </p>

            <textarea
              rows="4"
              placeholder="Enter consultation notes..."
              style={{
                width: "100%",
                marginTop: "15px",
                padding: "10px",
              }}
            />

            <button
              style={{
                marginTop: "15px",
                padding: "10px 20px",
              }}
            >
              Save Consultation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}