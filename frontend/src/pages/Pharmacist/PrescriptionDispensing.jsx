import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

export default function PrescriptionDispensing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const patient = {
    pid: "P001",
    name: "John Doe",
    bloodGroup: "O+",
    type: "OP",
  };

  const [medicines, setMedicines] = useState([
    {
      medicineId: 1,
      medicine: "Atorvastatin",
      scientificName: "Atorvastatin Calcium",
      days: 30,
      frequency: "Once Daily",
      unitCost: 35,
      dispensedQty: "",
      status: "Pending",
    },
    {
      medicineId: 2,
      medicine: "Paracetamol",
      scientificName: "Acetaminophen",
      days: 5,
      frequency: "Twice Daily",
      unitCost: 10,
      dispensedQty: "",
      status: "Pending",
    },
  ]);

  const handleQtyChange = (medicineId, value) => {
    setMedicines((prev) =>
      prev.map((item) =>
        item.medicineId === medicineId
          ? { ...item, dispensedQty: value }
          : item
      )
    );
  };

  const handleConfirmDispensing = () => {
    const hasEmptyQty = medicines.some(
      (item) => item.dispensedQty === ""
    );

    if (hasEmptyQty) {
      alert(
        "Please enter dispensed quantity for all medicines."
      );
      return;
    }

    navigate(
      `/pharmacist/prescriptions/${id}/success`,
      {
        state: {
          prescriptionId: id,
          patientName: patient.name,
          medicines,
        },
      }
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
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 text-sm mb-2"
            >
              ← Back
            </button>

            <h1 className="text-3xl font-bold text-gray-900">
              Prescription Dispensing
            </h1>

            <p className="text-gray-500">
              Prescription ID: {id}
            </p>
          </div>
        </div>

        {/* Patient Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">
            Patient Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-500 text-sm">
                PID
              </p>
              <p className="font-semibold">
                {patient.pid}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Patient Name
              </p>
              <p className="font-semibold">
                {patient.name}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Blood Group
              </p>
              <p className="font-semibold">
                {patient.bloodGroup}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Type
              </p>

              <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm">
                {patient.type}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Prescription Medicines
            </h2>

            <p className="text-gray-500 mt-1">
              Enter dispensed quantity for each
              medicine
            </p>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-4">
                  Medicine
                </th>
                <th className="px-6 py-4">
                  Days
                </th>
                <th className="px-6 py-4">
                  Frequency
                </th>
                <th className="px-6 py-4">
                  Dispensed Qty
                </th>
                <th className="px-6 py-4">
                  Unit Cost
                </th>
                <th className="px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {medicines.map((item) => (
                <tr
                  key={item.medicineId}
                  className="border-t"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold">
                      {item.medicine}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.scientificName}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    {item.days}
                  </td>

                  <td className="px-6 py-4">
                    {item.frequency}
                  </td>

                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0"
                      value={item.dispensedQty}
                      onChange={(e) =>
                        handleQtyChange(
                          item.medicineId,
                          e.target.value
                        )
                      }
                      className="w-24 border rounded-lg px-3 py-2"
                    />
                  </td>

                  <td className="px-6 py-4">
                    ₹{item.unitCost}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 mb-6">
          {medicines.map((item) => (
            <div
              key={item.medicineId}
              className="bg-white rounded-xl shadow-sm p-4"
            >
              <h3 className="font-semibold">
                {item.medicine}
              </h3>

              <p className="text-sm text-gray-500 mb-3">
                {item.scientificName}
              </p>

              <div className="space-y-2">
                <p>
                  <strong>Days:</strong>{" "}
                  {item.days}
                </p>

                <p>
                  <strong>Frequency:</strong>{" "}
                  {item.frequency}
                </p>

                <p>
                  <strong>Unit Cost:</strong> ₹
                  {item.unitCost}
                </p>

                <input
                  type="number"
                  min="0"
                  placeholder="Dispensed Qty"
                  value={item.dispensedQty}
                  onChange={(e) =>
                    handleQtyChange(
                      item.medicineId,
                      e.target.value
                    )
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />

                <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action */}
        <div className="flex justify-end">
          <button
            onClick={handleConfirmDispensing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium"
          >
            Confirm Dispensing
          </button>
        </div>
      </div>
    </Layout>
  );
}