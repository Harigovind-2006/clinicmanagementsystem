import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function PatientDetails() {
  const { id } = useParams();

  const [patientData, setPatientData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const patientRes = await api.get(`/patientapi/${id}`);
        setPatientData(patientRes.data);

        const historyRes = await api.get(`/appoinmentapi/history/${id}`);
        const appointments = historyRes.data.data || historyRes.data || [];
        
        appointments.sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
        setHistory(appointments);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Patient Not Found</h1>
        <p className="mt-2 text-gray-600">Patient ID: {id}</p>
        <Link to="/patients" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          ← Back to Patients List
        </Link>
      </div>
    );
  }

  const latestAppointment = history[0];

  const patient = {
    pid: patientData.pid || "--",
    name: patientData.name || "--",
    dob: patientData.dob ? new Date(patientData.dob).toLocaleDateString() : "--",
    gender: patientData.gender || "--",
    bloodGroup: patientData.bloodGroup || "--",
    phone: patientData.mobilePhone || "--",
    email: patientData.email || "--",
    address: patientData.address || "--",
    registered: patientData.createdAt ? new Date(patientData.createdAt).toLocaleDateString() : "--",
  };

  const status = {
    type: patientData.patientType ? patientData.patientType.toUpperCase() : "OP",
    lastBill: latestAppointment?.appointmentDate ? new Date(latestAppointment.appointmentDate).toLocaleDateString() : "--",
    admitted: latestAppointment?.createdAt ? new Date(latestAppointment.createdAt).toLocaleDateString() : "--",
    paymentUpto: latestAppointment?.paymentTimestamp ? new Date(latestAppointment.paymentTimestamp).toLocaleDateString() : "--",
  };

  const appointment = {
    token: latestAppointment?.tokenNumber ? `#${latestAppointment.tokenNumber}` : "--",
    doctor: latestAppointment?.doctor?.fullname || "--",
    time: latestAppointment?.appointmentTime || "--",
    date: latestAppointment?.appointmentDate ? new Date(latestAppointment.appointmentDate).toLocaleDateString() : "--",
    status: latestAppointment?.status ? latestAppointment.status.charAt(0).toUpperCase() + latestAppointment.status.slice(1) : "--",
  };

  const Observation = {
    DoctorNotes: latestAppointment?.sdObservations || "No notes recorded.",
  };

  const Vitals = {
    BP: latestAppointment?.vitals?.["Blood Pressure"] || "--",
    BloodGroup: patientData.bloodGroup || "--",
    Pulse: latestAppointment?.vitals?.["Pulse Rate"] || "--",
    Temperature: latestAppointment?.vitals?.["Temperature"] || "--",
    Weight: latestAppointment?.vitals?.["Weight"] || "--",
  };


  return (
    <div className="p-8 ml-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-blue-600 font-medium cursor-pointer">
            Patients
          </span>
          <span className="text-gray-400">{">"}</span>
          <span className="text-gray-700">{patient.name}</span>
        </div>

        <button className="border border-gray-300 rounded-xl px-5 py-2 font-medium hover:bg-gray-50">
          Edit Details
        </button>
      </div>

      {/* Tabs */}
      <div className="flex mb-6">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-l-xl font-medium">
          Current Visit
        </button>

        <button className="border border-gray-300 px-6 py-2 rounded-r-xl text-gray-700">
          History ({history.length})
        </button>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="col-span-2 bg-white border border-gray-300 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-8">
            Personal Information
          </h2>

          <div className="grid grid-cols-2 gap-y-8 gap-x-12">
            <div>
              <p className="text-gray-500 text-sm">PID</p>
              <p className="font-medium">{patient.pid}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p className="font-medium">{patient.name}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Date of Birth</p>
              <p className="font-medium">{patient.dob}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Gender</p>
              <p className="font-medium">{patient.gender}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Blood Group</p>
              <p className="font-medium">{patient.bloodGroup}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-medium">{patient.phone}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{patient.email}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Address</p>
              <p className="font-medium">{patient.address}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Registered</p>
              <p className="font-medium">{patient.registered}</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-white border border-gray-300 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Current Status
            </h2>

            <div className="flex justify-between mb-4">
              <span className="text-gray-500">Type</span>

              <span
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  status.type === "OP"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {status.type}
              </span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-gray-500">Admitted</span>
              <span>{status.admitted}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-gray-500">Payment Up To</span>
              <span>{status.paymentUpto}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Last Bill</span>
              <span>{status.lastBill}</span>
            </div>
          </div>

          {/* Appointment */}
          <div className="bg-white border border-gray-300 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Current Appointment
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Token</span>
                <span>{appointment.token}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Doctor</span>
                <span>{appointment.doctor}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span>{appointment.time}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span>{appointment.date}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>

                <span
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    appointment.status === "Waiting"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Vitals */}
        <div className="bg-white border border-gray-300 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Today's Vitals
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Blood Pressure</p>
              <p className="text-lg font-semibold">{Vitals.BP}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Blood Group</p>
              <p className="text-lg font-semibold">{Vitals.BloodGroup}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Pulse</p>
              <p className="text-lg font-semibold">{Vitals.Pulse}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Temperature</p>
              <p className="text-lg font-semibold">{Vitals.Temperature}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 col-span-2">
              <p className="text-sm text-gray-500">Weight</p>
              <p className="text-lg font-semibold">{Vitals.Weight}</p>
            </div>
          </div>
        </div>

        {/* Observation */}
        <div className="bg-white border border-gray-300 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Today's Observations
          </h2>

          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-lg  text-gray-500">
              {Observation.DoctorNotes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}