import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout"; // Adjust import path as needed
import PatientVisitTabs from "./PatientVisitTabs"; // Make sure to adjust this path to where you saved the component!
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

  // --- State for Patient Details (Editable) ---
  const { id } = useParams();

  const [patientData, setPatientData] = useState({});
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await api.get(`/patientapi/${id}`);
        setPatientData(response.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [id]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState()
  useEffect(() => {
  setEditForm(patientData);
}, [patientData]);

  // --- Handlers for Editing ---
  const handleSave = async () => {
  try {
    const { data } = await api.put(
      `/patientapi/${id}`,
      editForm
    );

    setPatientData(data);
    setEditForm(data);
    setIsEditing(false);

  } catch (error) {
    console.error(error);
  }
};

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  }
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

 

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col h-full min-h-screen">
        {/* Header - Matches PatientHistory perfectly */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 min-h-[40px]">
          <div className="flex items-center gap-2 sm:gap-3 text-sm flex-wrap">
            <Link
              to="/patients"
              className="text-blue-600 font-medium cursor-pointer hover:underline transition-colors"
            >
              Patients
            </Link>
            <span className="text-gray-400">{">"}</span>
            <span className="text-gray-900 font-medium">
              {patientData.name}
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

        {/* --- Unified Tabs Component --- */}
        {hasAdvancedAccess && (
          <PatientVisitTabs
            pid={patientData.pid}
            historyCount={1} // In a real app, you'd pass the actual history array length here
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
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      PID
                    </span>
                    <input
                      name="pid"
                      value={editForm.pid}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </span>
                    <input
                      name="name"
                      value={editForm.name}
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
                      value={editForm.dob}
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
                      value={editForm.gender}
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
                      value={editForm.bloodGroup}
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
                      value={editForm.mobilePhone}
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
                      value={editForm.email}
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
                      value={editForm.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </label>
                  <label className="space-y-1 sm:col-span-2 md:col-span-1">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Registered
                    </span>
                    <input
                      type="date"
                      name="registered"
                      value={editForm.registered}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                      {patientData.pid}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Name
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Date of Birth
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.dob}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Gender
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Blood Group
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.bloodGroup}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.mobilePhone}
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
                      {patientData.email}
                    </p>
                  </div>
                  <div className="sm:col-span-2 md:col-span-1">
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Address
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.address}
                    </p>
                  </div>
                  <div className="sm:col-span-2 md:col-span-1">
                    <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider mb-1">
                      Registered
                    </p>
                    <p className="font-semibold text-gray-900">
                      {patientData.registered}
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

                {/* Scrollable Container for Vitals */}
                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {Vitals.map((vital, index) => (
                      <div
                        key={index}
                        className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-4 flex flex-col justify-center"
                      >
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">
                          {vital.label}
                        </p>
                        <p className="text-base sm:text-lg font-bold text-gray-900">
                          {vital.value}
                        </p>
                      </div>
                    ))}
                  </div>
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
                      status.type === "OP"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {status.type}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Admitted</span>
                  <span className="font-semibold text-gray-900">
                    {status.admitted}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">
                    Payment Up To
                  </span>
                  <span className="font-semibold text-gray-900">
                    {status.paymentUpto}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500 font-medium">Last Bill</span>
                  <span className="font-semibold text-gray-900">
                    {status.lastBill}
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
                    {appointment.token}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Doctor</span>
                  <span className="font-semibold text-gray-900 text-right">
                    {appointment.doctor}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Time</span>
                  <span className="font-semibold text-gray-900">
                    {appointment.time}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Date</span>
                  <span className="font-semibold text-gray-900">
                    {appointment.date}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500 font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-md text-xs sm:text-sm font-bold tracking-wide ${
                      appointment.status === "Waiting"
                        ? "bg-amber-100 text-amber-700"
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

        {/* Full-width Observation Section - Scrollable */}
        {hasAdvancedAccess && (
          <div className="mt-6 bg-white border border-gray-200 shadow-sm rounded-2xl p-5 sm:p-6 lg:p-8 flex flex-col">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 shrink-0">
              Today's Observations
            </h2>

            <div className="bg-yellow-50/50 border border-yellow-100/50 rounded-xl p-5 max-h-64 overflow-y-auto">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {Observation.DoctorNotes}
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
