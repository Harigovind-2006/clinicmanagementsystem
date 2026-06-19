import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import Layout from "../../components/Layout";

export default function NursePage() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState("");

  const rooms = [
    {
      id: 101,
      blood: "O+",
      gender: "Male",
      pname: "Ravi Kumar",
      pid: "P003",
      date: "21/02/2026",
      medicines: "0/0",
      procedure: "0/0",
    },
    {
      id: 102,
      blood: "AB+",
      gender: "Male",
      pname: "Suresh Rao",
      pid: "P005",
      date: "12/10/2025",
      medicines: "0/0",
      procedure: "0/0",
    },
  ];

  const filteredRooms = rooms.filter(
    (room) =>
      room.pid.toLowerCase().includes(name.toLowerCase()) ||
      room.pname.toLowerCase().includes(name.toLowerCase())
  );

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden bg-white p-2 rounded-lg shadow"
            >
              ☰
            </button>

            <h1 className="text-3xl font-bold text-gray-900">
              Patient List
            </h1>
          </div>

          <SearchBar
            name={name}
            setName={setName}
          />
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-4">
          {filteredRooms.map((room) => (
            <div
              key={room.pid}
              className="bg-white rounded-xl shadow p-4"
            >
              <p>
                <strong>PID:</strong> {room.pid}
              </p>

              <p>
                <strong>Name:</strong> {room.pname}
              </p>

              <p>
                <strong>Gender:</strong> {room.gender}
              </p>

              <p>
                <strong>Blood Group:</strong> {room.blood}
              </p>

              <p>
                <strong>Room:</strong> {room.id}
              </p>

              <button
                onClick={() =>
                  navigate(`/patient/${room.pid}`, {
                    state: room,
                  })
                }
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                View Patient
              </button>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block bg-white rounded-xl shadow overflow-hidden">
          <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-100 font-semibold text-gray-700">
            <div>PID</div>
            <div>Name</div>
            <div>Gender</div>
            <div>Blood Group</div>
            <div>Room</div>
            <div>Action</div>
          </div>

          {filteredRooms.map((room) => (
            <div
              key={room.pid}
              className="grid grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-gray-50"
            >
              <div>{room.pid}</div>
              <div>{room.pname}</div>
              <div>{room.gender}</div>
              <div>{room.blood}</div>
              <div>Room {room.id}</div>

              <button
                onClick={() =>
                  navigate(`/patient/${room.pid}`, {
                    state: room,
                  })
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                View Patient
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}