import React, { useState } from "react";
import "./Admission.css";
export default function Admission() {
  const [name, setName] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [advance, setAdvance] = useState("");
  const rooms = [
    {
      roomNo: 101,
      facilities: "AC, TV, Attached Bathroom, Bystander Cot",
      charge: 2000,
      status: "Occupied",
      patient: "Ravi Kumar",
      pid: "P003",
      admitted: "2026-06-01",
      advance: 5000,
    },

    {
      roomNo: 102,
      facilities: "AC, TV, Attached Bathroom",
      charge: 1500,
      status: "Occupied",
      patient: "Suresh Rao",
      pid: "P005",
      admitted: "2026-06-05",
      advance: 3000,
    },

    {
      roomNo: 103,
      facilities: "Fan, Shared Bathroom",
      charge: 800,
      status: "Available",
      patient: null,
      pid: null,
      admitted: null,
      advance: null,
    },

    {
      roomNo: 201,
      facilities: "AC, TV, Attached Bathroom, Bystander Cot",
      charge: 3000,
      status: "Closed",
      patient: null,
      pid: null,
      admitted: null,
      advance: null,
    },

    {
      roomNo: 202,
      facilities: "AC, TV, Attached Bathroom",
      charge: 2500,
      status: "Available",
      patient: null,
      pid: null,
      admitted: null,
      advance: null,
    },
  ];
  const [roomData, setRoomData] = useState(rooms);
  const filteredRooms = roomData.filter(
    (room) =>
      room.roomNo.toString().includes(name) ||
      room.patient?.toLowerCase().includes(name.toLowerCase()),
  );

  function handleDischarge(roomNo) {
    const updatedRooms = roomData.map((room) =>
      room.roomNo === roomNo
        ? {
            ...room,
            status: "Available",
            patient: null,
            pid: null,
            admitted: null,
            advance: null,
          }
        : room,
    );

    setRoomData(updatedRooms);
  }
  const today = new Date().toISOString().split("T")[0];
  function handleAssignRoom() {
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
              admitted: today,
              advance: advance,
            }
          : room,
      ),
    );

    setShowAssignModal(false);
  }

  return (
    <>
      <header className="admission-header">
        <h1>Admissions</h1>
        <button className="assign-btn" onClick={() => setShowAssignModal(true)}>
          + Assign Room
        </button>
      </header>

      <div className="table-class">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search rooms"
        />
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Facilities</th>
              <th>Per Night</th>
              <th>Status</th>
              <th>Patient</th>
              <th>Admitted</th>
              <th>Advance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room) => (
              <tr key={room.roomNo}>
                <td>Room {room.roomNo}</td>
                <td>{room.facilities}</td>
                <td>Rs. {room.charge}</td>

                <td>
                  <span className={`status-badge ${room.status.toLowerCase()}`}>
                    {room.status}
                  </span>
                </td>

                <td>{room.patient || "—"}</td>

                <td>{room.admitted || "—"}</td>

                <td>{room.advance ? `Rs. ${room.advance}` : "—"}</td>

                <td>
                  {room.status === "Occupied" && (
                    <button
                      className="discharge-btn"
                      onClick={() => handleDischarge(room.roomNo)}
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
      {showAssignModal && (
        <div className="assign-modal-overlay">
          <div className="assign-modal">
            <div className="assign-modal-header">
              <h2>Assign Room to Patient</h2>

              <button
                className="close-btn"
                onClick={() => setShowAssignModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="assign-form">
              <label>Patient</label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">Select patient...</option>
                <option>John Doe</option>
                <option>Jane Smith</option>
                <option>Anjali Gupta</option>
              </select>

              <label>Room</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                <option value="">Select available room...</option>

                {roomData
                  .filter((room) => room.status === "Available")
                  .map((room) => (
                    <option key={room.roomNo} value={room.roomNo}>
                      Room {room.roomNo}
                    </option>
                  ))}
              </select>
              <label>From Date</label>
              <input type="date" min={today} defaultValue={today} />

              <label>Payment Upto (optional)</label>
              <input type="date" min={today} />

              <label>Advance Payment (Rs.)</label>
              <input
                type="number"
                placeholder="Enter advance amount"
                value={advance}
                onChange={(e) => setAdvance(e.target.value)}
                required
              />

              <p className="assign-note">
                This amount will be recorded as paid and will be used for
                discharge settlement.
              </p>

              <div className="assign-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>

                <button className="confirm-btn" onClick={handleAssignRoom}>
                  Assign Room & Record Advance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
