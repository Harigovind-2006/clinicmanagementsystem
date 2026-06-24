import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import PharmacyBill from "./PharmacyBill";

export default function DispensingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const billRef = useRef();

  const {
    prescriptionId = "N/A",
    patientName = "Unknown Patient",
    medicines = [],
  } = location.state || {};

  const patient = {
    name: patientName,
    pid: prescriptionId,
  };

  const handlePrintBill = () => {
    const printContents =
      billRef.current.innerHTML;

    const printWindow = window.open(
      "",
      "",
      "width=1200,height=800"
    );

    printWindow.document.write(`
      <html>
        <head>
          <title>Pharmacy Bill</title>
          <style>
            body{
              font-family: Arial, sans-serif;
              padding:20px;
            }

            table{
              width:100%;
              border-collapse:collapse;
            }

            th,td{
              border:1px solid #ddd;
              padding:10px;
              text-align:left;
            }

            th{
              background:#f3f4f6;
            }

            .total{
              margin-top:20px;
              text-align:right;
              font-size:20px;
              font-weight:bold;
            }
          </style>
        </head>

        <body>
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handlePrintUpdatedBill = () => {
    alert("Updated bill generated successfully!");
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 mb-3"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Dispensing Confirmation
          </h1>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 text-center">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-green-100 text-green-600 text-4xl font-bold mb-4">
            ✓
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dispensing Confirmed
          </h2>

          <p className="text-gray-600">
            Prescription #{prescriptionId} has
            been successfully dispensed.
          </p>
        </div>

        {/* Medicines */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Dispensed Medicines
          </h3>

          <p className="mb-4">
            <span className="font-semibold">
              Patient:
            </span>{" "}
            {patientName}
          </p>

          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4">
                    Medicine
                  </th>

                  <th className="text-left p-4">
                    Scientific Name
                  </th>

                  <th className="text-left p-4">
                    Dispensed Qty
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {medicines.map((item) => (
                  <tr
                    key={item.medicineId}
                    className="border-b"
                  >
                    <td className="p-4">
                      {item.medicine}
                    </td>

                    <td className="p-4">
                      {item.scientificName}
                    </td>

                    <td className="p-4">
                      {item.dispensedQty}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm">
                        Dispensed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="lg:hidden space-y-4">
            {medicines.map((item) => (
              <div
                key={item.medicineId}
                className="border rounded-xl p-4"
              >
                <p className="font-semibold">
                  {item.medicine}
                </p>

                <p className="text-sm text-gray-500">
                  {item.scientificName}
                </p>

                <p className="mt-2">
                  <strong>Qty:</strong>{" "}
                  {item.dispensedQty}
                </p>

                <span className="inline-block mt-3 px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm">
                  Dispensed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-end">
          <button
            onClick={handlePrintBill}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
          >
            Print Pharmacy Bill
          </button>

          <button
            onClick={handlePrintUpdatedBill}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
          >
            Print Updated Bill
          </button>
        </div>

        {/* Hidden Printable Bill */}
        <div className="hidden">
          <PharmacyBill
            ref={billRef}
            patient={patient}
            medicines={medicines}
          />
        </div>
      </div>
    </Layout>
  );
}