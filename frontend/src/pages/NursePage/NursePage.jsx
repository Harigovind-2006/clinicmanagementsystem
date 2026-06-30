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

            <h1 className="text-2xl font-semibold text-gray-900">
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
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5"
            >
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">PID:</span> {room.pid}
              </p>

              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold text-gray-900">Name:</span> {room.pname}
              </p>

              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold text-gray-900">Gender:</span> {room.gender}
              </p>

              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold text-gray-900">Blood Group:</span> {room.blood}
              </p>

              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold text-gray-900">Room:</span> {room.id}
              </p>

              <button
                onClick={() =>
                  navigate(`/patient/${room.pid}`, {
                    state: room,
                  })
                }
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition-colors"
              >
                View Patient
              </button>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50/50 text-sm font-semibold text-gray-700">
            <div>PID</div>
            <div>Name</div>
            <div>Gender</div>
            <div>Blood Group</div>
            <div>Room</div>
            <div className="text-right">Action</div>
          </div>

          {filteredRooms.map((room) => (
            <div
              key={room.pid}
              className="grid grid-cols-6 gap-4 px-6 py-4 border-t border-gray-200 items-center hover:bg-gray-50/50 transition-colors"
            >
              <div className="text-sm text-gray-900 font-medium">{room.pid}</div>
              <div className="text-sm text-gray-900 font-medium">{room.pname}</div>
              <div className="text-sm text-gray-700">{room.gender}</div>
              <div className="text-sm text-gray-700">{room.blood}</div>
              <div className="text-sm text-gray-700">Room {room.id}</div>

              <button
                onClick={() =>
                  navigate(`/patient/${room.pid}`, {
                    state: room,
                  })
                }
                className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
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