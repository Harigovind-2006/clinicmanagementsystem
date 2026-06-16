import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/Layout";

export default function PatientDashboard() {
  const navigate=useNavigate();
  const location = useLocation();
  const patient = location.state;

  return (
    <div className="flex">
      <Layout />

      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-2 mb-6 text-gray-600">
          <button className="font-medium">Patient</button>
          <span>{">"}</span>
          <p>{patient?.pname}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500 text-sm mb-2">Room</h2>

          <h1 className="text-3xl font-bold text-gray-900">
            Room {patient?.id}
          </h1>
        </div>
      </main>
    </div>
  );
}