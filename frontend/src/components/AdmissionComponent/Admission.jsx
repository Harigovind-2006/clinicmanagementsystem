import React, { useState } from "react";
import Layout from "../../components/Layout";

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

  const rooms = [
    {
      roomNo: 101,
      facilities: "AC, TV, Attached Bathroom, Bystander Cot",
      charge: 2000,
      status: "Occupied",
      patient: "Ravi Kumar",
      admitted: "2026-06-01",
      advance: 5000,
    },
    {
      roomNo: 102,
      facilities: "AC, TV, Attached Bathroom",
      charge: 1500,
      status: "Occupied",
      patient: "Suresh Rao",
      admitted: "2026-06-05",
      advance: 3000,
    },
    {
      roomNo: 103,
      facilities: "Fan, Shared Bathroom",
      charge: 800,
      status: "Available",
      patient: null,
      admitted: null,
      advance: null,
    },
    {
      roomNo: 201,
      facilities: "AC, TV, Attached Bathroom",
      charge: 3000,
      status: "Closed",
      patient: null,
      admitted: null,
      advance: null,
    },
    {
      roomNo: 202,
      facilities: "AC, TV, Attached Bathroom",
      charge: 2500,
      status: "Available",
      patient: null,
      admitted: null,
      advance: null,
    },
  ];

  // Mock Patient Data Dictionary
  const patients = {
    "Ravi Kumar": {
      pid: "P003",
      name: "Ravi Kumar",
      dob: "1972-01-15",
      gender: "Male",
      bloodGroup: "B+",
      phone: "9003456789",
      paymentUpto: "2026-06-10",
    },
    "Suresh Rao": {
      pid: "P004",
      name: "Suresh Rao",
      dob: "1980-03-12",
      gender: "Male",
      bloodGroup: "O+",
      phone: "9876543210",
      paymentUpto: "2026-06-15",
    },
  };

  const [roomData, setRoomData] = useState(rooms);

  const filteredRooms = roomData.filter(
    (room) =>
      room.roomNo.toString().includes(search) ||
      room.patient?.toLowerCase().includes(search.toLowerCase())
  );

  const handlePatientClick = (room) => {
    const patientInfo = patients[room.patient] || {
      pid: "N/A",
      name: room.patient,
      dob: "—",
      gender: "—",
      bloodGroup: "—",
      phone: "—",
      paymentUpto: "—",
    };

    setSelectedPatientData({
      room,
      patient: patientInfo,
    });
    setShowPatientModal(true);
  };

  const handleAssignRoom = () => {
    // Advance payment is now mandatory along with patient and room selection
    if (!selectedPatient || !selectedRoom || !advance) {
      setErrorMsg("Please fill all required fields, including Advance Payment.");
      return;
    }

    setRoomData((prev) =>
      prev.map((room) =>
        room.roomNo === Number(selectedRoom)
          ? {
              ...room,
              status: "Occupied",
              patient: selectedPatient,
              admitted: fromDate,
              advance: advance ? Number(advance) : null,
            }
          : room
      )
    );

    // Reset fields & close modal
    setShowAssignModal(false);
    setSelectedPatient("");
    setSelectedRoom("");
    setAdvance("");
    setFromDate(today);
    setPaymentUpto("");
    setErrorMsg("");
  };

  // Toggle Room between Available and Closed
  const toggleRoomStatus = (roomNo, currentStatus) => {
    const newStatus = currentStatus === "Available" ? "Closed" : "Available";
    setRoomData((prev) =>
      prev.map((room) =>
        room.roomNo === roomNo
          ? {
              ...room,
              status: newStatus,
            }
          : room
      )
    );
  };

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
                  <tr key={room.roomNo} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 text-sm font-bold text-gray-900">Room {room.roomNo}</td>
                    <td className="p-4 text-sm text-gray-600">{room.facilities}</td>
                    <td className="p-4 text-sm text-gray-900 font-medium">₹{room.charge}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          room.status === "Occupied"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : room.status === "Available"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-600 border-gray-300"
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {room.patient ? (
                        <button
                          onClick={() => handlePatientClick(room)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-left"
                        >
                          {room.patient}
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{room.admitted || <span className="text-gray-400">—</span>}</td>
                    <td className="p-4 text-sm text-gray-900 font-medium">
                      {room.advance ? `₹${room.advance}` : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="p-4 text-right">
                      {room.status === "Available" && (
                        <button
                          onClick={() => toggleRoomStatus(room.roomNo, room.status)}
                          className="text-xs font-medium border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Mark Closed
                        </button>
                      )}
                      {room.status === "Closed" && (
                        <button
                          onClick={() => toggleRoomStatus(room.roomNo, room.status)}
                          className="text-xs font-medium border border-green-300 text-green-700 px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          Mark Available
                        </button>
                      )}
                      {room.status === "Occupied" && (
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
            <div key={room.roomNo} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-900">Room {room.roomNo}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    room.status === "Occupied"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : room.status === "Available"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-600 border-gray-300"
                  }`}
                >
                  {room.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-2">{room.facilities}</p>
              <div className="grid grid-cols-2 gap-y-2 text-sm pt-3 border-t border-gray-100 mt-3">
                <span className="text-gray-500">Price:</span>
                <span className="font-medium text-gray-900">₹{room.charge}/night</span>
                
                <span className="text-gray-500">Patient:</span>
                <span>
                  {room.patient ? (
                    <button
                      onClick={() => handlePatientClick(room)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-left"
                    >
                      {room.patient}
                    </button>
                  ) : (
                    " —"
                  )}
                </span>

                <span className="text-gray-500">Advance:</span>
                <span className="font-medium text-gray-900">{room.advance ? `₹${room.advance}` : "—"}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                {room.status === "Available" && (
                  <button
                    onClick={() => toggleRoomStatus(room.roomNo, room.status)}
                    className="w-full text-sm font-medium border border-gray-300 text-gray-600 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Mark Closed for Cleaning
                  </button>
                )}
                {room.status === "Closed" && (
                  <button
                    onClick={() => toggleRoomStatus(room.roomNo, room.status)}
                    className="w-full text-sm font-medium border border-green-300 text-green-700 py-2 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    Mark as Available
                  </button>
                )}
                {room.status === "Occupied" && (
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
                  Room {selectedPatientData.room.roomNo} — Patient Details
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
                    <p><strong className="text-gray-600">Room:</strong> Room {selectedPatientData.room.roomNo}</p>
                    <p><strong className="text-gray-600">Status:</strong> {selectedPatientData.room.status}</p>
                    <p><strong className="text-gray-600">Facilities:</strong> {selectedPatientData.room.facilities}</p>
                    <p><strong className="text-gray-600">Per Night:</strong> Rs. {selectedPatientData.room.charge}</p>
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
                    <p><strong className="text-gray-600">Phone:</strong> {selectedPatientData.patient.phone}</p>
                    <p><strong className="text-gray-600">Admitted:</strong> {selectedPatientData.room.admitted}</p>
                    <p><strong className="text-gray-600">Payment Upto:</strong> {selectedPatientData.patient.paymentUpto}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-5">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Billing Summary</h3>
                <div className="grid grid-cols-3 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Advance Paid</p>
                    <p className="font-bold text-gray-900">Rs. {selectedPatientData.room.advance || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Total Bill</p>
                    <p className="font-bold text-gray-900">Rs. 9000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Balance Due</p>
                    <p className="font-bold text-red-600">
                      Rs. {9000 - (selectedPatientData.room.advance || 0)}
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
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Anjali Gupta">Anjali Gupta</option>
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
                      .filter((room) => room.status === "Available")
                      .map((room) => (
                        <option key={room.roomNo} value={room.roomNo}>
                          Room {room.roomNo} (₹{room.charge}/night)
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