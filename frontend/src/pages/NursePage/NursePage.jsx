import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import Layout from "../../components/Layout";
import api from "../../api/axios";

export default function NursePage() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/roomsapi");
        const allRooms = response.data.data || [];
        
        // Filter only occupied rooms and format them to match what the component expects
        const occupiedRooms = await Promise.all(
          allRooms
            .filter((room) => room.status === "occupied" && room.currentPatient)
            .map(async (room) => {
              try {
                const patientId = room.currentPatient._id;
                const pRes = await api.get(`/patientapi/${patientId}`);
                const patientData = pRes.data;
                
                // Get the medicines and procedures count
                const historyRes = await api.get(`/appoinmentapi/history/${patientId}`);
                const appointments = historyRes.data.data || historyRes.data || [];
                const latestApp = appointments[0] || {};
                
                const medCount = latestApp.medicine?.length || 0;
                const medGivenCount = latestApp.medicine?.filter(m => m.given).length || 0;
                
                const procCount = latestApp.procedure?.length || 0;
                const procDoneCount = 0; // fallback local status flag
                
                return {
                  id: room.roomId || "N/A",
                  blood: patientData.bloodGroup || "--",
                  gender: patientData.gender || "--",
                  pname: patientData.name || "Unknown",
                  pid: patientData.pid || room.currentPatient.pid || patientId,
                  dbId: patientId, // keep reference to actual database ID if needed
                  date: room.occupiedDate ? new Date(room.occupiedDate).toLocaleDateString() : "--",
                  medicines: `${medGivenCount}/${medCount}`,
                  procedure: `${procDoneCount}/${procCount}`,
                };
              } catch (err) {
                console.error("Error fetching patient details for room:", err);
                return {
                  id: room.roomId || "N/A",
                  blood: "--",
                  gender: "--",
                  pname: room.currentPatient?.name || "Unknown",
                  pid: room.currentPatient?.pid || "N/A",
                  dbId: room.currentPatient?._id || "N/A",
                  date: room.occupiedDate ? new Date(room.occupiedDate).toLocaleDateString() : "--",
                  medicines: "0/0",
                  procedure: "0/0",
                };
              }
            })
        );
        
        setRooms(occupiedRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomsData();
  }, []);

  const filteredRooms = rooms.filter(
    (room) =>
      room.pid.toLowerCase().includes(name.toLowerCase()) ||
      room.pname.toLowerCase().includes(name.toLowerCase())
  );

  if (loading) {
    return (
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading patient list...</p>
          </div>
        </div>
      </Layout>
    );
  }

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