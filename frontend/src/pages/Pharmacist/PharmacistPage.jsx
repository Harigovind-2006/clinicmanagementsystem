import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import PrescriptionDispensing from "./PrescriptionDispensing";

export default function PharmacistPage() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const prescriptions = [
    {
      id: 1,
      name: "John Doe",
      pid: "P001",
      type: "OP",
      medicineCount: 1,
      status: "Pending",
    },
  ];

  const filteredPrescriptions = prescriptions.filter(
    (item) =>
      item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.pid
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleDispense = (prescriptionId) => {
  navigate(
    `/pharmacist/prescriptions/${prescriptionId}`
  );
};

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 bg-white rounded-lg shadow"
          >
            ☰
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Patient Medicines
            </h1>

            <p className="text-gray-500 mt-1">
              Manage and dispense patient
              prescriptions
            </p>
          </div>
        </div>

        {/* Top Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <button className="w-fit bg-blue-600 text-white px-6 py-3 rounded-xl font-medium">
            All Prescriptions (
            {filteredPrescriptions.length})
          </button>

          <p className="text-gray-500">
            {filteredPrescriptions.length} patient(s)
            with prescriptions
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <input
            type="text"
            placeholder="Search by patient name or PID..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600">
                <th className="px-6 py-4">
                  Patient
                </th>
                <th className="px-6 py-4">
                  PID
                </th>
                <th className="px-6 py-4">
                  Type
                </th>
                <th className="px-6 py-4">
                  Medicines
                </th>
                <th className="px-6 py-4">
                  Dispensing Status
                </th>
                <th className="px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPrescriptions.length >
              0 ? (
                filteredPrescriptions.map(
                  (item) => (
                    <tr
                      key={item.id}
                    >
                      <td className="px-6 py-4">
                        {item.name}
                      </td>

                      <td className="px-6 py-4">
                        {item.pid}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm">
                          {item.type}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {
                          item.medicineCount
                        }{" "}
                        item(s)
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleDispense(
                              item.id
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Dispense
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    No prescriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredPrescriptions.length >
          0 ? (
            filteredPrescriptions.map(
              (item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm p-4"
                >
                  <div className="space-y-2">
                    <p>
                      <strong>
                        Patient:
                      </strong>{" "}
                      {
                        item.name
                      }
                    </p>

                    <p>
                      <strong>
                        PID:
                      </strong>{" "}
                      {item.pid}
                    </p>

                    <p>
                      <strong>
                        Medicines:
                      </strong>{" "}
                      {
                        item.medicineCount
                      }{" "}
                      item(s)
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm">
                        {item.type}
                      </span>

                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleDispense(
                        item.id
                      )
                    }
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    Dispense
                  </button>
                </div>
              )
            )
          ) : (
            <div className="bg-white rounded-xl p-6 text-center text-gray-500">
              No prescriptions found
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}