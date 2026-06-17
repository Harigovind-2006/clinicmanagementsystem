import React, { useState } from 'react'
import "./Admission.css"
export default function Admission() {
    const [name,setName]=useState("")
    
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
    room.patient?.toLowerCase().includes(name.toLowerCase())
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
      : room
  );

  setRoomData(updatedRooms);
}
  return (
    <>
    <header className="admission-header">
  <h1>Admissions</h1>
  <button className="assign-btn">+  Assign Rooms</button>
</header> 

    
    
    <div className='table-class'>
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder='Search rooms'/>
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
        <span
          className={`status-badge ${room.status.toLowerCase()}`}
        >
          {room.status}
        </span>
      </td>

      <td>{room.patient || "—"}</td>

      <td>{room.admitted || "—"}</td>

      <td>
        {room.advance
          ? `Rs. ${room.advance}`
          : "—"}
      </td>

      <td>
        {room.status === "Occupied" && (
          <button className="discharge-btn" onClick={()=>handleDischarge(room.roomNo)}>
            Discharge
          </button>
        )}

        
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
    </>
  )
}
