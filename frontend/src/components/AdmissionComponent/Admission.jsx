import React, { useState } from "react";
import Layout from "../../components/Layout";

export default function Admission() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [search, setSearch] = useState("");

  const [showAssignModal, setShowAssignModal] =
    useState(false);

  const [selectedPatient, setSelectedPatient] =
    useState("");

  const [selectedRoom, setSelectedRoom] =
    useState("");

  const [advance, setAdvance] = useState("");

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const rooms = [
    {
      roomNo: 101,
      facilities:
        "AC, TV, Attached Bathroom, Bystander Cot",
      charge: 2000,
      status: "Occupied",
      patient: "Ravi Kumar",
      admitted: "2026-06-01",
      advance: 5000,
    },
    {
      roomNo: 102,
      facilities:
        "AC, TV, Attached Bathroom",
      charge: 1500,
      status: "Occupied",
      patient: "Suresh Rao",
      admitted: "2026-06-05",
      advance: 3000,
    },
    {
      roomNo: 103,
      facilities:
        "Fan, Shared Bathroom",
      charge: 800,
      status: "Available",
      patient: null,
      admitted: null,
      advance: null,
    },
    {
      roomNo: 201,
      facilities:
        "AC, TV, Attached Bathroom",
      charge: 3000,
      status: "Closed",
      patient: null,
      admitted: null,
      advance: null,
    },
    {
      roomNo: 202,
      facilities:
        "AC, TV, Attached Bathroom",
      charge: 2500,
      status: "Available",
      patient: null,
      admitted: null,
      advance: null,
    },
  ];

  const [roomData, setRoomData] =
    useState(rooms);

  const filteredRooms =
    roomData.filter(
      (room) =>
        room.roomNo
          .toString()
          .includes(search) ||
        room.patient
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const handleAssignRoom = () => {
    if (
      !selectedPatient ||
      !selectedRoom
    ) {
      alert(
        "Please fill all required fields"
      );
      return;
    }

    setRoomData((prev) =>
      prev.map((room) =>
        room.roomNo ===
        Number(selectedRoom)
          ? {
              ...room,
              status: "Occupied",
              patient:
                selectedPatient,
              admitted: today,
              advance,
            }
          : room
      )
    );

    setShowAssignModal(false);
    setSelectedPatient("");
    setSelectedRoom("");
    setAdvance("");
  };

  const handleDischarge = (
    roomNo
  ) => {
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
    <Layout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={
        setSidebarOpen
      }
    >
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admissions
            </h1>

            <p className="text-gray-500">
              Manage room allocation
            </p>
          </div>

          <button
            onClick={() =>
              setShowAssignModal(
                true
              )
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
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
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full md:w-96 border rounded-xl p-3"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">
                    Room
                  </th>
                  <th className="p-4 text-left">
                    Facilities
                  </th>
                  <th className="p-4 text-left">
                    Per Night
                  </th>
                  <th className="p-4 text-left">
                    Status
                  </th>
                  <th className="p-4 text-left">
                    Patient
                  </th>
                  <th className="p-4 text-left">
                    Admitted
                  </th>
                  <th className="p-4 text-left">
                    Advance
                  </th>
                  <th className="p-4 text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRooms.map(
                  (room) => (
                    <tr
                      key={
                        room.roomNo
                      }
                      className="border-t"
                    >
                      <td className="p-4">
                        Room{" "}
                        {
                          room.roomNo
                        }
                      </td>

                      <td className="p-4">
                        {
                          room.facilities
                        }
                      </td>

                      <td className="p-4">
                        ₹
                        {
                          room.charge
                        }
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            room.status ===
                            "Occupied"
                              ? "bg-blue-100 text-blue-700"
                              : room.status ===
                                "Available"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {
                            room.status
                          }
                        </span>
                      </td>

                      <td className="p-4">
                        {room.patient ||
                          "—"}
                      </td>

                      <td className="p-4">
                        {room.admitted ||
                          "—"}
                      </td>

                      <td className="p-4">
                        {room.advance
                          ? `₹${room.advance}`
                          : "—"}
                      </td>

                      <td className="p-4">
                        {room.status ===
                          "Occupied" && (
                          <button
                            onClick={() =>
                              handleDischarge(
                                room.roomNo
                              )
                            }
                            className="border border-red-300 text-red-600 px-3 py-2 rounded-lg hover:bg-red-50"
                          >
                            Discharge
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredRooms.map(
            (room) => (
              <div
                key={room.roomNo}
                className="bg-white rounded-2xl shadow-sm p-5"
              >
                <h3 className="font-bold text-lg">
                  Room{" "}
                  {room.roomNo}
                </h3>

                <p className="text-gray-600 mt-2">
                  {
                    room.facilities
                  }
                </p>

                <p>
                  ₹{room.charge}/night
                </p>

                <p>
                  Patient:{" "}
                  {room.patient ||
                    "—"}
                </p>

                <p>
                  Advance:{" "}
                  {room.advance
                    ? `₹${room.advance}`
                    : "—"}
                </p>

                {room.status ===
                  "Occupied" && (
                  <button className="w-full mt-4 border border-red-300 text-red-600 py-3 rounded-xl">
                    Discharge
                  </button>
                )}
              </div>
            )
          )}
        </div>

        {/* Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6">
              <h2 className="text-2xl font-bold mb-6">
                Assign Room
              </h2>

              <div className="space-y-4">
                <select
                  value={
                    selectedPatient
                  }
                  onChange={(e) =>
                    setSelectedPatient(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">
                    Select Patient
                  </option>
                  <option>
                    John Doe
                  </option>
                  <option>
                    Jane Smith
                  </option>
                  <option>
                    Anjali Gupta
                  </option>
                </select>

                <select
                  value={
                    selectedRoom
                  }
                  onChange={(e) =>
                    setSelectedRoom(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">
                    Select Room
                  </option>

                  {roomData
                    .filter(
                      (room) =>
                        room.status ===
                        "Available"
                    )
                    .map((room) => (
                      <option
                        key={
                          room.roomNo
                        }
                        value={
                          room.roomNo
                        }
                      >
                        Room{" "}
                        {
                          room.roomNo
                        }
                      </option>
                    ))}
                </select>

                <input
                  type="number"
                  placeholder="Advance Amount"
                  value={advance}
                  onChange={(e) =>
                    setAdvance(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() =>
                    setShowAssignModal(
                      false
                    )
                  }
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleAssignRoom
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Assign Room
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}