import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import PatientVisitTabs from "./PatientVisitTabs";
import api from "../../api/axios";

export default function PatientDetails() {
  const navigate = useNavigate();

  // Fetch role from local storage (defaults to empty string if not found)
  const role = (localStorage.getItem("role") || "").toLowerCase();

  // Define permissions
  const isManager = role === "manager";
  const isSeniorDoctor = role === "seniordoctor";

  // Determine if the user should see Manager/Doctor level details (History, Edit, Vitals, Observations)
  const hasAdvancedAccess = isManager || isSeniorDoctor;

  // --- State for Patient Details ---
  const { id } = useParams();

  const [patientData, setPatientData] = useState({});
  const [appointment, setAppointment] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // ✅ Added error state

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Fetch both patient and appointment data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch patient data
        const patientRes = await api.get(`/patientapi/${id}`);
        setPatientData(patientRes.data);

        // Fetch patient history/appointments
        const historyRes = await api.get(`/appoinmentapi/history/${id}`);

        const appointments = historyRes.data.data || historyRes.data || [];

        // ✅ Sort appointments by createdAt (newest first)
        appointments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setHistory(appointments);

        // Set the most recent appointment as current
        if (appointments.length > 0) {
          setAppointment(appointments[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load patient data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Update editForm when patientData changes
  useEffect(() => {
    setEditForm(patientData);
  }, [patientData]);

  // --- Handlers for Editing ---
  const handleSave = async () => {
    try {
      const { data } = await api.put(`/patientapi/${id}`, editForm);

      setPatientData(data);
      setEditForm(data);
      setIsEditing(false);
      setError("");
    } catch (error) {
      console.error("Error saving patient data:", error);
      setError("Failed to save changes. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(patientData);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // ✅ Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Loading screen
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading patient data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // ✅ Helper function for status color
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-700";
    const statusMap = {
      scheduled: "bg-blue-100 text-blue-700",
      waiting: "bg-amber-100 text-amber-700",
      "in-progress": "bg-purple-100 text-purple-700",
      completed: "bg-green-100 text-green-700",
      "follow-up": "bg-indigo-100 text-indigo-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col h-full min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 min-h-[40px]">
          <div className="flex items-center gap-2 sm:gap-3 text-sm flex-wrap">
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ←
            </button>
            <Link
              to="/patients"
              className="text-blue-600 font-medium cursor-pointer hover:underline transition-colors"
            >
              Patients
            </Link>
            <span className="text-gray-400">{">"}</span>
            <span className="text-gray-900 font-medium">
              {patientData.name || "Unknown Patient"}
            </span>
          </div>

          {/* Edit Details Controls - Only visible to Manager/Senior Doctor */}
          {hasAdvancedAccess && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none border border-gray-300 rounded-xl px-5 py-2 font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 sm:flex-none border border-blue-600 rounded-xl px-5 py-2 font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="w-full sm:w-auto border border-gray-300 rounded-xl px-5 py-2 font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Edit Details
                </button>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* --- Unified Tabs Component --- */}
        {hasAdvancedAccess && (
          <PatientVisitTabs
            id={id} // ✅ Pass 'id', NOT 'pid'
            historyCount={history.length}
            activeTab="current"
          />
        )}

        {/* Top Section (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1">
          {/* Left Column (Personal Info & Vitals) */}
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            {/* Personal Information */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 sm:p-6 lg:p-8 shrink-0">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-gray-900">
                Personal Information
              </h2>

              {isEditing ? (
                // EDIT MODE
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* ✅ PID - Disabled (auto-generated) */}
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      PID
                    </span>
                    <input
                      name="pid"
                      value={editForm.pid || ""}
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </span>
                    <input
                      name="name"
                      value={editForm.name || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Date of Birth
                    </span>
                    <input
                      type="date"
                      name="dob"
                      value={editForm.dob ? editForm.dob.substring(0, 10) : ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Gender
                    </span>
                    <select
                      name="gender"
                      value={editForm.gender || "Male"}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Blood Group
                    </span>
                    <select
                      name="bloodGroup"
                      value={editForm.bloodGroup || "Unknown"}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      {[
                        "A+",
                        "A-",
                        "B+",
                        "B-",
                        "AB+",
                        "AB-",
                        "O+",
                        "O-",
                        "Unknown",
                      ].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Phone
                    </span>
                    <input
                      name="mobilePhone"
                      maxLength={10}
                      value={editForm.mobilePhone || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </label>
                  <label className="space-y-1 sm:col-span-2 md:col-span-1">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Email
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </label>
                  <label className="space-y-1 sm:col-span-2 md:col-span-1">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Address
                    </span>
                    <input
                      name="address"
                      value={editForm.address || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </label>
                  <label className="space-y-1 sm:col-span-2 md:col-span-1">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Patient Type
                    </span>
                    <select
                      name="patientType"
                      value={editForm.patientType || "op"}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="op">OP</option>
                      <option value="ip">IP</option>
                    </select>
                  </label>
                  {/* ✅ Registered - Read-only */}
                  <label className="space-y-1 sm:col-span-2 md:col-span-1">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Registered
                    </span>
                    <input
                      value={
                        patientData.createdAt
                          ? new Date(patientData.createdAt).toLocaleDateString()
                          : "-"
                      }
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                    />
                  </label>
                </div>
              ) : (
                // VIEW MODE
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 sm:gap-y-8 gap-x-6 sm:gap-x-8">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      PID
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.pid || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Name
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Date of Birth
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.dob
                        ? new Date(patientData.dob).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Gender
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.gender || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Blood Group
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.bloodGroup || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.mobilePhone || "-"}
                    </p>
                  </div>
                  <div className="sm:col-span-2 md:col-span-1">
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <p
                      className="font-semibold text-gray-900 truncate"
                      title={patientData.email}
                    >
                      {patientData.email || "-"}
                    </p>
                  </div>
                  <div className="sm:col-span-2 md:col-span-1">
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Address
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.address || "-"}
                    </p>
                  </div>
                  <div className="sm:col-span-2 md:col-span-1">
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Patient Type
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.patientType?.toUpperCase() || "-"}
                    </p>
                  </div>
                  <div className="sm:col-span-2 md:col-span-1">
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Registered
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.createdAt
                        ? new Date(patientData.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Vitals - Stretches to fill remaining height */}
            {hasAdvancedAccess && (
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-[250px]">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 shrink-0">
                  Today's Vitals
                </h2>

                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                  {appointment?.vitals &&
                  Object.keys(appointment.vitals).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {Object.entries(appointment.vitals).map(
                        ([label, value]) => (
                          <div
                            key={label}
                            className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-4 flex flex-col justify-center"
                          >
                            <p className="text-xs sm:text-sm text-gray-500 mb-1 capitalize">
                              {label.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="text-base sm:text-lg font-bold text-gray-900">
                              {value}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No vitals recorded for today
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Status & Appt) */}
          <div className="flex flex-col gap-6 h-full">
            {/* Current Status */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 sm:p-6 shrink-0">
              <h2 className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6 text-gray-900">
                Current Status
              </h2>

              <div className="space-y-4 text-sm sm:text-base">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Type</span>
                  <span
                    className={`px-3 py-1 rounded-md text-xs sm:text-sm font-bold tracking-wide ${
                      patientData.patientType?.toUpperCase() === "OP"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {patientData.patientType?.toUpperCase() || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Admitted</span>
                  <span className="font-semibold text-gray-900">
                    {appointment
                      ? new Date(appointment.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">
                    Payment Method
                  </span>
                  <span className="font-semibold text-gray-900">
                    {appointment?.paymentMethod || "-"}
                  </span>
                </div>
                {appointment?.paymentMethod === "UPI" && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">UPI ID</span>
                    <span className="font-semibold text-gray-900">
                      {appointment?.upiId || "-"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">
                    Consultation Fee
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹{appointment?.consultationFee || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">
                    Registration Fee
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹{appointment?.registrationFee || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500 font-medium">Total Bill</span>
                  <span className="font-semibold text-gray-900">
                    ₹
                    {(appointment?.consultationFee || 0) +
                      (appointment?.registrationFee || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Appointment - Stretches to align with Vitals */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 sm:p-6 flex-1 flex flex-col">
              <h2 className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6 text-gray-900 shrink-0">
                Current Appointment
              </h2>

              <div className="space-y-4 text-sm sm:text-base flex-1">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Token</span>
                  <span className="font-bold text-gray-900">
                    #{appointment?.tokenNumber || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Doctor</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">
                      {appointment?.doctor?.name || "-"}
                    </span>
                    {appointment?.specialization && (
                      <p className="text-xs text-gray-500">
                        {appointment.specialization}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Time</span>
                  <span className="font-semibold text-gray-900">
                    {appointment?.appointmentTime || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Date</span>
                  <span className="font-semibold text-gray-900">
                    {appointment?.appointmentDate
                      ? new Date(
                          appointment.appointmentDate,
                        ).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                {appointment?.complaints && (
                  <div className="flex flex-col items-start pb-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium mb-1">
                      Chief Complaint
                    </span>
                    <p className="text-gray-900 text-sm">
                      {appointment.complaints}
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500 font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-md text-xs sm:text-sm font-bold tracking-wide ${getStatusColor(appointment?.status)}`}
                  >
                    {appointment?.status || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Observations Section */}
        {hasAdvancedAccess && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Junior Doctor Observations */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 sm:p-6 lg:p-8 flex flex-col">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 shrink-0">
                Junior Doctor Observations
              </h2>
              <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-5 max-h-48 overflow-y-auto flex-1">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {appointment?.jdObservations ||
                    "No junior doctor observations recorded"}
                </p>
              </div>
            </div>

            {/* Senior Doctor Observations */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 sm:p-6 lg:p-8 flex flex-col">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 shrink-0">
                Senior Doctor Observations
              </h2>
              <div className="bg-yellow-50/50 border border-yellow-100/50 rounded-xl p-5 max-h-48 overflow-y-auto flex-1">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {appointment?.sdObservations ||
                    "No senior doctor observations recorded"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Procedures Section */}
        {hasAdvancedAccess &&
          appointment?.procedure &&
          appointment.procedure.length > 0 && (
            <div className="mt-6 bg-white border border-gray-200 shadow-sm rounded-2xl p-5 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900">
                Procedures
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointment.procedure.map((proc, index) => (
                  <div
                    key={index}
                    className="bg-purple-50/50 border border-purple-100/50 rounded-xl p-4"
                  >
                    <p className="font-semibold text-gray-900">
                      {proc.procedureName || proc}
                    </p>
                    {proc.amount && (
                      <p className="text-sm text-gray-600">₹{proc.amount}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Medicines Section */}
        {hasAdvancedAccess &&
          appointment?.medicine &&
          appointment.medicine.length > 0 && (
            <div className="mt-6 bg-white border border-gray-200 shadow-sm rounded-2xl p-5 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900">
                Prescribed Medicines
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointment.medicine.map((med, index) => (
                  <div
                    key={index}
                    className="bg-green-50/50 border border-green-100/50 rounded-xl p-4"
                  >
                    <p className="font-semibold text-gray-900">
                      {med.medicine?.medicinename || med.medicine || "Unknown"}
                    </p>
                    <div className="mt-1 text-sm text-gray-600 space-y-1">
                      {med.days && <p>Duration: {med.days} days</p>}
                      {med.frequency && <p>Frequency: {med.frequency}</p>}
                      {med.quantity && <p>Quantity: {med.quantity}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </Layout>
  );
}
