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
    if (!selectedPatient || !selectedRoom) {
      alert("Please fill all required fields");
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
  };

  const handleDischarge = (roomNo) => {
    setRoomData((prev) =>
      prev.map((room) =>
        room.roomNo === roomNo
          ? {
              ...room,
              status: "Available",
              patient: null,
              admitted: null,
              advance: null,
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
            onClick={() => setShowAssignModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
          >
            + Assign Room
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <input
            type="text"
            placeholder="Search room or patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Room</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Facilities</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Per Night</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Patient</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Admitted</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Advance</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredRooms.map((room) => (
                  <tr key={room.roomNo} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900">Room {room.roomNo}</td>
                    <td className="p-4 text-sm text-gray-600">{room.facilities}</td>
                    <td className="p-4 text-sm text-gray-900">₹{room.charge}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          room.status === "Occupied"
                            ? "bg-blue-100 text-blue-700"
                            : room.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {room.patient ? (
                        <button
                          onClick={() => handlePatientClick(room)}
                          className="text-blue-600 hover:text-blue-800 font-medium underline text-left"
                        >
                          {room.patient}
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{room.admitted || <span className="text-gray-400">—</span>}</td>
                    <td className="p-4 text-sm text-gray-900">
                      {room.advance ? `₹${room.advance}` : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="p-4">
                      {room.status === "Occupied" && (
                        <button
                          onClick={() => handleDischarge(room.roomNo)}
                          className="border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 text-sm font-medium transition"
                        >
                          Discharge
                        </button>
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
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    room.status === "Occupied"
                      ? "bg-blue-100 text-blue-700"
                      : room.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {room.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-2">{room.facilities}</p>
              <div className="grid grid-cols-2 gap-y-2 text-sm pt-2 border-t border-gray-100 mt-3">
                <span className="text-gray-500">Price:</span>
                <span className="font-medium text-gray-900">₹{room.charge}/night</span>
                <span className="text-gray-500">Patient:</span>
                <span>
                  {room.patient ? (
                    <button
                      onClick={() => handlePatientClick(room)}
                      className="text-blue-600 hover:text-blue-800 font-medium underline text-left"
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

              {room.status === "Occupied" && (
                <button
                  onClick={() => handleDischarge(room.roomNo)}
                  className="w-full mt-4 border border-red-200 text-red-600 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition"
                >
                  Discharge
                </button>
              )}
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

        {/* Assign Room Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Assign Room to Patient</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Patient *</label>
                  <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select patient...</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Anjali Gupta">Anjali Gupta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Room *</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">From Date *</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Upto <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={paymentUpto}
                    onChange={(e) => setPaymentUpto(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Advance Payment (Rs.)</label>
                  <input
                    type="number"
                    placeholder="Enter advance amount collected"
                    value={advance}
                    onChange={(e) => setAdvance(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    This amount will be recorded as paid and will be used for discharge settlement.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignRoom}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm shadow-blue-200"
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