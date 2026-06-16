import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SeniorDoctor.css";

export default function SeniorDoctor() {
  const current = new Date();
  const formattedDate = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;
  const navigate = useNavigate();
  const patients = [
    {
      token: 1,
      pid: "P001",
      pname: "John Doe",
      gender: "Male",
      blood: "O+",
      date: "2026-06-15",
      time: "9.00",
      status: false,
      dob: "1985-04-12",
      phone: "9001234567",
      notes: "Patient recovering well. Continue medication.",
      observations: "Patient complains of chest pain and shortness of breath.",
      bp: "120/80",
      pulse: "72 bpm",
      temp: "98.6 °F",
      weight: "75 kg",
      ip: false,
    },

    {
      token: 2,
      pid: "P002",
      pname: "Priya Sharma",
      gender: "Female",
      blood: "A+",
      date: "2026-06-15",
      time: "9.30",
      status: false,
      dob: "1992-08-25",
      phone: "9876543210",
      notes: "Responding well to treatment.",
      observations: "Mild fever and fatigue.",
      bp: "118/76",
      pulse: "78 bpm",
      temp: "99.1 °F",
      weight: "62 kg",
      ip: false,
    },

    {
      token: 3,
      pid: "P003",
      pname: "Ravi Kumar",
      gender: "Male",
      blood: "B+",
      date: "2026-06-15",
      time: "10.00",
      status: false,
      dob: "1972-01-15",
      phone: "9003456789",
      notes: "Stable condition. Under observation.",
      observations: "History of hypertension.",
      bp: "130/85",
      pulse: "74 bpm",
      temp: "98.4 °F",
      weight: "81 kg",
      ip: false,
    },

    {
      token: 4,
      pid: "P004",
      pname: "Anjali Gupta",
      gender: "Female",
      blood: "AB+",
      date: "2026-06-15",
      time: "10.30",
      status: false,
      dob: "1988-11-05",
      phone: "9812345678",
      notes: "Post-surgery recovery progressing well.",
      observations: "No signs of infection.",
      bp: "115/72",
      pulse: "70 bpm",
      temp: "98.2 °F",
      weight: "58 kg",
      ip: false,
    },

    {
      token: 5,
      pid: "P005",
      pname: "Suresh Rao",
      gender: "Male",
      blood: "AB+",
      date: "2026-06-15",
      time: "11.00",
      status: false,
      dob: "1968-09-18",
      phone: "9123456780",
      notes: "Diabetic patient. Monitor sugar levels.",
      observations: "Occasional dizziness reported.",
      bp: "140/90",
      pulse: "80 bpm",
      temp: "98.7 °F",
      weight: "84 kg",
      ip: false,
    },
  ];
  const [activeTab, setActiveTab] = useState("waiting");

  const waitingCount = patients.filter((patient) => !patient.status).length;

  const completedCount = patients.filter((patient) => patient.status).length;

  const filteredPatients = patients.filter((patient) =>
    activeTab === "waiting" ? !patient.status : patient.status,
  );

  return (
    <>
      <header>
        <h1>Dashboard</h1>
        <h2>{formattedDate} - Your Patient Queue</h2>
      </header>

      <main className="main-class">
        <div className="btn-grp">
          <button
            className={activeTab === "waiting" ? "active" : ""}
            onClick={() => setActiveTab("waiting")}
          >
            Waiting ({waitingCount})
          </button>

          <button
            className={activeTab === "completed" ? "active" : ""}
            onClick={() => setActiveTab("completed")}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="patient-list">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>PID</th>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.pid}>
                  <td>#{patient.token}</td>
                  <td>{patient.pid}</td>
                  <td>{patient.pname}</td>
                  <td>{patient.date}</td>
                  <td>{patient.time}</td>

                  <td>{patient.status ? "Completed" : "Waiting"}</td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/patient/${patient.pid}`, {
                          state: patient,
                        })
                      }
                    >
                      Open Consultation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
