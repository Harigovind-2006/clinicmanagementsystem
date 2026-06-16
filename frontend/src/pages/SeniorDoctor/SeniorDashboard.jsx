import React from "react";
import "./SeniorDashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import Medicines from "../NursePage/components/Medicines";
import Procedure from "../NursePage/components/Procedure";

export default function SeniorDashboard() {
  const location = useLocation();
  const patient = location.state;
  const navigate = useNavigate();
  return (
    <>
      <header className="sd-header">
        <button onClick={() => navigate("/")}>Back to Queue</button>
        <span>&gt;</span>
        <span>{patient.pname}</span>
      </header>
      <div className="sd-dashboard-grid">
        {/* Patient Info */}
        <div className="sd-patient-card">
          <h2>Patient Information</h2>

          <div className="sd-info-row">
            <span>PID</span>
            <span>{patient.pid}</span>
          </div>

          <div className="sd-info-row">
            <span>Name</span>
            <span>{patient.pname}</span>
          </div>

          <div className="sd-info-row">
            <span>DOB</span>
            <span>{patient.dob}</span>
          </div>

          <div className="sd-info-row">
            <span>Gender</span>
            <span>{patient.gender}</span>
          </div>

          <div className="sd-info-row">
            <span>Blood Group</span>
            <span>{patient.blood}</span>
          </div>

          <div className="sd-info-row">
            <span>Phone</span>
            <span>{patient.phone}</span>
          </div>

          <button className="sd-change-btn">Change to IP</button>
        </div>

        {/* Center Section */}
        <div className="sd-middle-column">
          <div className="sd-vitals-card">
            <h2>Vitals</h2>

            <div className="sd-vitals-grid">
              <div className="vital-box">
                <p>BP</p>
                <h3>{patient.bp}</h3>
              </div>
      
              <div className="vital-box">
                <p>Pulse</p>
                <h3>{patient.pulse}</h3>
              </div>

              <div className="vital-box">
                <p>Temp</p>
                <h3>{patient.temp}</h3>
              </div>

              <div className="vital-box">
                <p>Weight</p>
                <h3>{patient.weight}</h3>
              </div>
            </div>
          </div>

          <div className="sd-observation-card">
            <h3>JD Observations</h3>
            <p>{patient.observations}</p>
          </div>
        </div>

        {/* Appointment */}
        <div className="sd-appointment-card">
          <h2>Appointment Details</h2>

          <div className="info-row">
            <span>Token</span>
            <span>#{patient.token}</span>
          </div>

          <div className="info-row">
            <span>Time</span>
            <span>{patient.time}</span>
          </div>

          <div className="info-row">
            <span>Date</span>
            <span>{patient.date}</span>
          </div>

          <div className="info-row">
            <span>Specialization</span>
            <span>Cardiology</span>
          </div>
        </div>
        <div className="sd-medicine-grid">
            <h1>Presciption</h1>
           <Medicines />
        </div>
        <div className="sd-prescription-grid">
            <Procedure/>
        </div>
      </div>
    </>
  );
}
