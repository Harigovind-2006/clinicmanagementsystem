import React, { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import "./PatientDashboard.css";
import Overview from "./components/Overview";
import Medicines from "./components/Medicines";
import Procedure from "./components/Procedure";

export default function PatientDashboard() {
  const navigate=useNavigate();
  const location = useLocation();
  const patient = location.state;
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="dashboard-container">
      <div className="side-bar">
        <button onClick={()=>navigate("/")}>Patient</button> {">"} <p>{patient.pname}</p>
      </div>
      <div className="summary-cards">
  <div className="room-card">
    <h2>Room</h2>
    <h1>Room {patient.id}</h1>
  </div>

  <div className="date-card">
    <h2>Admitted</h2>
    <h1>{patient.date}</h1>
  </div>

  <div className="medicine-card">
    <h2>Medicines Given</h2>
    <h1> {patient.medicines}</h1>
  </div>

  <div className="procedure-card">
    <h2>Procedures Done</h2>
    <h1>{patient.procedure}</h1>
  </div>
</div>
      <div className="tabs">
        <button onClick={() => setActiveTab("overview")}>Overview</button>

        <button onClick={() => setActiveTab("medicines")}>
          Medicines & Prescriptions 
        </button>

        <button onClick={() => setActiveTab("procedures")}>
          Procedures
        </button>
      </div>
      {activeTab === "overview" && (
        <Overview patient={patient}/>
      )}
      {activeTab==="medicines"&&(
        <Medicines />
      )}
      {activeTab==="procedures"&&(
        <Procedure />
      )}
    </div>
  );
}
