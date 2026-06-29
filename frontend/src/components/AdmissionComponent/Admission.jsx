import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axios";

export default function Admission() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  // New Patient Detail Modal States
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatientData, setSelectedPatientData] = useState(null);

  // Form Field States
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [advance, setAdvance] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [paymentUpto, setPaymentUpto] = useState("");

  // State for API data
  const [roomData, setRoomData] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchRooms();
    fetchPatients();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get("/roomsapi");
      setRoomData(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setErrorMsg("Failed to load room data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patientapi");
      setPatients(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setErrorMsg("Failed to load patient data.");
    }
  };

  // Filter rooms based on search
  const filteredRooms = roomData.filter(
    (room) =>
      room.roomId?.toString().includes(search) ||
      room.currentPatient?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handlePatientClick = (room) => {
    const patientInfo =
      patients.find(
        (p) =>
          p._id === room.currentPatient?._id ||
          p._id === room.currentPatient
      ) || {
        pid: "N/A",
        name: room.currentPatient?.name || "Unknown",
        dob: "—",
        gender: "—",
        bloodGroup: "—",
        mobilePhone: "—",
        paymentUpto: "—",
      };

    setSelectedPatientData({
      room,
      patient: patientInfo,
    });
    setShowPatientModal(true);
  };

  const handleAssignRoom = async () => {
    // Advance payment is mandatory along with patient and room selection
    if (!selectedPatient || !selectedRoom || !advance) {
      setErrorMsg("Please fill all required fields, including Advance Payment.");
      return;
    }

    try {
      const managerId = localStorage.getItem("userId");

      await api.put(`/roomsapi/assign/${managerId}`, {
        roomId: selectedRoom,
        patientId: selectedPatient,
        advancePaid: Number(advance),
        fromDate: fromDate,
        paymentUpto: paymentUpto || undefined,
      });

      // Reset fields & close modal
      setShowAssignModal(false);
      setSelectedPatient("");
      setSelectedRoom("");
      setAdvance("");
      setFromDate(today);
      setPaymentUpto("");
      setErrorMsg("");
      
      // Refresh room data
      fetchRooms();
    } catch (err) {
      console.error("Error assigning room:", err);
      setErrorMsg(err.response?.data?.message || "Failed to assign room. Please try again.");
    }
  };

  // Toggle Room between Available and Closed
  const toggleRoomStatus = async (roomId, currentStatus) => {
    const newStatus = currentStatus === "Available" ? "Closed" : "Available";
    
    try {
      const managerId = localStorage.getItem("userId");
      
      await api.put(`/roomsapi/update/${managerId}`, {
        roomId: roomId,
        updateData: {
          status: newStatus.toLowerCase()
        }
      });

      // Refresh room data
      fetchRooms();
    } catch (err) {
      console.error("Error updating room status:", err);
      setErrorMsg(err.response?.data?.message || "Failed to update room status.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading rooms...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admissions</h1>
            <p className="text-gray-500">Manage room allocation</p>
          </div>

          <button
            onClick={() => { setShowAssignModal(true); setErrorMsg(""); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition shadow-sm font-medium"
          >
            + Assign Room
          </button>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg("")}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-2xl mb-6 overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Search room or patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-4 text-gray-600 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/70 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Room</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Facilities</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Per Night</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Admitted</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Advance</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredRooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 text-sm font-bold text-gray-900">Room {room.roomId}</td>
                    <td className="p-4 text-sm text-gray-600">{room.facilities || room.roomCategory || "—"}</td>
                    <td className="p-4 text-sm text-gray-900 font-medium">₹{room.charge || room.price || 0}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          room.status === "Occupied" || room.status === "occupied"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : room.status === "Available" || room.status === "available"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-600 border-gray-300"
                        }`}
                      >
                        {room.status || "Available"}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {room.currentPatient ? (
                        <button
                          onClick={() => handlePatientClick(room)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-left"
                        >
                          {room.currentPatient.name}
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {room.admittedAt ? new Date(room.admittedAt).toLocaleDateString() : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="p-4 text-sm text-gray-900 font-medium">
                      {room.advancePaid ? `₹${room.advancePaid}` : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="p-4 text-right">
                      {(room.status === "Available" || room.status === "available") && (
                        <button
                          onClick={() => toggleRoomStatus(room._id, room.status)}
                          className="text-xs font-medium border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Mark Closed
                        </button>
                      )}
                      {(room.status === "Closed" || room.status === "closed") && (
                        <button
                          onClick={() => toggleRoomStatus(room._id, room.status)}
                          className="text-xs font-medium border border-green-300 text-green-700 px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          Mark Available
                        </button>
                      )}
                      {(room.status === "Occupied" || room.status === "occupied") && (
                        <span className="text-gray-400 text-xs italic">In Use</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredRooms.map((room) => (
            <div key={room._id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-900">Room {room.roomId}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    room.status === "Occupied" || room.status === "occupied"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : room.status === "Available" || room.status === "available"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-600 border-gray-300"
                  }`}
                >
                  {room.status || "Available"}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-2">{room.facilities || room.roomCategory || "—"}</p>
              <div className="grid grid-cols-2 gap-y-2 text-sm pt-3 border-t border-gray-100 mt-3">
                <span className="text-gray-500">Price:</span>
                <span className="font-medium text-gray-900">₹{room.charge || room.price || 0}/night</span>
                
                <span className="text-gray-500">Patient:</span>
                <span>
                  {room.currentPatient ? (
                    <button
                      onClick={() => handlePatientClick(room)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-left"
                    >
                      {room.currentPatient.name}
                    </button>
                  ) : (
                    " —"
                  )}
                </span>

                <span className="text-gray-500">Advance:</span>
                <span className="font-medium text-gray-900">{room.advancePaid ? `₹${room.advancePaid}` : "—"}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                {(room.status === "Available" || room.status === "available") && (
                  <button
                    onClick={() => toggleRoomStatus(room._id, room.status)}
                    className="w-full text-sm font-medium border border-gray-300 text-gray-600 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Mark Closed for Cleaning
                  </button>
                )}
                {(room.status === "Closed" || room.status === "closed") && (
                  <button
                    onClick={() => toggleRoomStatus(room._id, room.status)}
                    className="w-full text-sm font-medium border border-green-300 text-green-700 py-2 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    Mark as Available
                  </button>
                )}
                {(room.status === "Occupied" || room.status === "occupied") && (
                  <p className="w-full text-center text-gray-400 text-sm italic">Room is currently in use</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Patient Details Modal */}
        {showPatientModal && selectedPatientData && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">
                  Room {selectedPatientData.room.roomId} — Patient Details
                </h2>
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Room Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-gray-600">Room:</strong> Room {selectedPatientData.room.roomId}</p>
                    <p><strong className="text-gray-600">Status:</strong> {selectedPatientData.room.status}</p>
                    <p><strong className="text-gray-600">Facilities:</strong> {selectedPatientData.room.facilities || selectedPatientData.room.roomCategory || "—"}</p>
                    <p><strong className="text-gray-600">Per Night:</strong> Rs. {selectedPatientData.room.charge || selectedPatientData.room.price || 0}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Patient Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-gray-600">PID:</strong> {selectedPatientData.patient.pid}</p>
                    <p><strong className="text-gray-600">Name:</strong> {selectedPatientData.patient.name}</p>
                    <p><strong className="text-gray-600">DOB:</strong> {selectedPatientData.patient.dob}</p>
                    <p><strong className="text-gray-600">Gender:</strong> {selectedPatientData.patient.gender}</p>
                    <p><strong className="text-gray-600">Blood Group:</strong> {selectedPatientData.patient.bloodGroup}</p>
                    <p><strong className="text-gray-600">Mobile:</strong> {selectedPatientData.patient.mobilePhone}</p>
                    <p><strong className="text-gray-600">Admitted:</strong> {selectedPatientData.room.admittedAt ? new Date(selectedPatientData.room.admittedAt).toLocaleDateString() : "—"}</p>
                    <p><strong className="text-gray-600">Payment Upto:</strong> {selectedPatientData.patient.paymentUpto || "—"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-5">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Billing Summary</h3>
                <div className="grid grid-cols-3 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Advance Paid</p>
                    <p className="font-bold text-gray-900">Rs. {selectedPatientData.room.advancePaid || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Total Bill</p>
                    <p className="font-bold text-gray-900">Rs. 9000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Balance Due</p>
                    <p className="font-bold text-red-600">
                      Rs. {9000 - (selectedPatientData.room.advancePaid || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign Room Modal (Compact Design) */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6 md:p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Assign Room to Patient</h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                >
                  ✕
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium border border-red-100">
                  {errorMsg}
                </div>
              )}

              {/* Grid Layout for compact height */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Patient <span className="text-red-500">*</span></label>
                  <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select patient...</option>
                    {patients
                      .filter((p) => p.patientType === "ip" || p.patientType === "IP")
                      .map((patient) => (
                        <option key={patient._id} value={patient._id}>
                          {patient.pid} - {patient.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Room <span className="text-red-500">*</span></label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select available room...</option>
                    {roomData
                      .filter((room) => room.status === "Available" || room.status === "available")
                      .map((room) => (
                        <option key={room._id} value={room._id}>
                          Room {room.roomId} (₹{room.charge || room.price || 0}/night)
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">From Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    min={today}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Payment Upto <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="date"
                    min={fromDate}
                    value={paymentUpto}
                    onChange={(e) => setPaymentUpto(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Advance Payment (Rs.) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    placeholder="Enter advance amount collected"
                    value={advance}
                    onChange={(e) => setAdvance(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    This amount is mandatory to confirm the room assignment and will be deducted from the final bill.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignRoom}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition shadow-sm text-sm"
                >
                  Assign Room & Record Advance
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}