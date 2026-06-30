import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
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
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="p-3 sm:p-4 lg:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Patient List
          </h1>
        </div>

        {/* Main Container - White box with search and list */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Search Bar - inside the container */}
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100 ">
            <div className="w-full max-w-3xl">
              <SearchBar name={name} setName={setName} />
            </div>
          </div>

          {/* Mobile View - Cards */}
          <div className="lg:hidden p-4 sm:p-5 space-y-4">
            {filteredRooms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No patients found
              </div>
            ) : (
              filteredRooms.map((room) => (
                <div
                  key={room.pid}
                  className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">PID</span>
                      <span className="font-medium text-gray-900">{room.pid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name</span>
                      <span className="font-medium text-gray-900">{room.pname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gender</span>
                      <span className="text-gray-700">{room.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Blood Group</span>
                      <span className="text-gray-700">{room.blood}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Room</span>
                      <span className="text-gray-700">Room {room.id}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/patient/${room.pid}`, {
                        state: room,
                      })
                    }
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    View Patient
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    PID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No patients found
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr
                      key={room.pid}
                      className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {room.pid}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {room.pname}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{room.gender}</td>
                      <td className="px-6 py-4 text-gray-700">{room.blood}</td>
                      <td className="px-6 py-4 text-gray-700">Room {room.id}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            navigate(`/patient/${room.pid}`, {
                              state: room,
                            })
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                          View Patient
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}