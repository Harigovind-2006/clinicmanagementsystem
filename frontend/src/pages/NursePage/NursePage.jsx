import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

import "./NursePage.css";
export default function NursePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const rooms = [
    {
      id: 101,
      blood: "O+",
      gender: "Male",
      pname: "Ravi Kumar",
      pid: "P003",
      date:"21/02/2026",
      medicines:"0/0",
      procedure:"0/0"
    },
    {
      id: 102,
      blood: "AB+",
      gender: "Male",
      pname: "Suresh Rao",
      pid: "P005",
      date:"12/10/2025",
      medicines:"0/0",
      procedure:"0/0"
    },
  ];
   console.log(rooms);
  const filteredRooms = rooms.filter(
    (room) =>
      room.pid.toLowerCase().includes(name.toLowerCase()) ||
      room.pname.toLowerCase().includes(name.toLowerCase()),
  );
  return (
    <div className="patient-list-container">
      <header>
        <h1>Patient List</h1>
      </header>
      <div className="search-bar">
        <SearchBar name={name} setName={setName} />
      </div>
      <div className="patient-list">
        <div className="column-heading">
          <h4>PID</h4>
          <h4>Name</h4>
          <h4>Gender</h4>
          <h4>Blood Group</h4>
          <h4>Rooms</h4>
          <h4>Action</h4>
        </div>
        <div className="patient-list-content">
          {filteredRooms.map((room) => (
            <div className="patients-list" key={room.pid}>
              <p>{room.pid}</p>
              <p>{room.pname}</p>
              <p>{room.gender}</p>
              <p>{room.blood}</p>
              <p>Room {room.id}</p>
              <button
                className="btn-class"
                onClick={() => navigate(`/patient/${room.pid}`,{
                    state: room
                })}
              >
                View Patient
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
