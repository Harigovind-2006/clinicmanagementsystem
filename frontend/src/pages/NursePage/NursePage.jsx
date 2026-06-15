import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Layout from "../../components/Layout";

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
    },
    {
      id: 102,
      blood: "AB+",
      gender: "Male",
      pname: "Suresh Rao",
      pid: "P005",
    },
  ];

  const filteredRooms = rooms.filter(
    (room) =>
      room.pid.toLowerCase().includes(name.toLowerCase()) ||
      room.pname.toLowerCase().includes(name.toLowerCase())
  );

  return (
    <>
      <Layout />

      <div className="ml-64 min-h-screen bg-gray-50 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Patient List
          </h1>

          <SearchBar name={name} setName={setName} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-100 font-semibold text-gray-700">
            <div>PID</div>
            <div>Name</div>
            <div>Gender</div>
            <div>Blood Group</div>
            <div>Room</div>
            <div>Action</div>
          </div>

          {/* Data Rows */}
          {filteredRooms.map((room) => (
            <div
              key={room.pid}
              className="grid grid-cols-6 gap-4 px-6 py-4 border-t border-gray-200 items-center"
            >
              <div>{room.pid}</div>
              <div>{room.pname}</div>
              <div>{room.gender}</div>
              <div>{room.blood}</div>
              <div>Room {room.id}</div>

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                onClick={() =>
                  navigate(`/patient/${room.pid}`, {
                    state: room,
                  })
                }
              >
                View Patient
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}