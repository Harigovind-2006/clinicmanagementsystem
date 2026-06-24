import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";

export default function BillPayment() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");

  const billSummary = [
    {
      pid: "P001",
      pname: "John Doe",
      total: 700,
      paid: 700,
      pending: 0,
      transactions: [
        {
          id: 1,
          purpose: "Registration",
          amount: 200,
          method: "Cash",
          reference: "-",
          date: "2026-05-20",
          status: "Paid",
        },
        {
          id: 2,
          purpose: "Consultation",
          amount: 500,
          method: "UPI",
          reference: "UPI123456",
          date: "2026-05-20",
          status: "Paid",
        },
      ],
    },
    {
      pid: "P002",
      pname: "Jane Smith",
      total: 700,
      paid: 200,
      pending: 500,
      transactions: [
        {
          id: 1,
          purpose: "Registration",
          amount: 200,
          method: "Cash",
          reference: "-",
          date: "2026-05-21",
          status: "Paid",
        },
        {
          id: 2,
          purpose: "Consultation",
          amount: 500,
          method: "UPI",
          reference: "UPI789456",
          date: "2026-05-21",
          status: "Pending",
        },
      ],
    },
    {
      pid: "P003",
      pname: "Ravi Kumar",
      total: 9000,
      paid: 9000,
      pending: 0,
      transactions: [
        {
          id: 1,
          purpose: "Admission Fee",
          amount: 1000,
          method: "Cash",
          reference: "-",
          date: "2026-05-18",
          status: "Paid",
        },
        {
          id: 2,
          purpose: "MRI Scan",
          amount: 5000,
          method: "Card",
          reference: "TXN123456",
          date: "2026-05-19",
          status: "Paid",
        },
        {
          id: 3,
          purpose: "Consultation",
          amount: 3000,
          method: "UPI",
          reference: "UPI654321",
          date: "2026-05-20",
          status: "Paid",
        },
      ],
    },
    {
      pid: "P005",
      pname: "Suresh Rao",
      total: 8000,
      paid: 8000,
      pending: 0,
      transactions: [
        {
          id: 1,
          purpose: "Admission Fee",
          amount: 1000,
          method: "Cash",
          reference: "-",
          date: "2026-05-15",
          status: "Paid",
        },
        {
          id: 2,
          purpose: "CT Scan",
          amount: 4000,
          method: "Card",
          reference: "TXN789123",
          date: "2026-05-16",
          status: "Paid",
        },
        {
          id: 3,
          purpose: "Procedure Charges",
          amount: 3000,
          method: "UPI",
          reference: "UPI456123",
          date: "2026-05-17",
          status: "Paid",
        },
      ],
    },
  ];

  const filteredPatients = billSummary.filter(
    (patient) =>
      patient.pname.toLowerCase().includes(search.toLowerCase()) ||
      patient.pid.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 border rounded-lg bg-white"
          >
            ☰
          </button>

          <div>
            <h1 className="text-4xl font-semibold text-slate-900">
              Bills & Payments
            </h1>

            <p className="text-gray-500 mt-1">
              Manage patient billing and payments
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-2xl mb-6 overflow-hidden">
          <input
            type="text"
            placeholder="Search by Patient Name or PID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-4 text-gray-600 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-6 bg-white border-b border-gray-200 px-6 py-4 text-sm font-medium text-gray-500">
            <div>Patient</div>
            <div>PID</div>
            <div>Total</div>
            <div>Paid</div>
            <div>Pending</div>
            <div>Action</div>
          </div>

          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <div
                key={patient.pid}
                className="grid grid-cols-6 px-6 py-4 border-t border-gray-200 items-center"
              >
                <div className="text-slate-700 font-medium">
                  {patient.pname}
                </div>

                <div className="text-gray-500">{patient.pid}</div>

                <div className="text-gray-600">₹{patient.total}</div>

                <div className="text-green-600">₹{patient.paid}</div>

                <div>
                  {patient.pending > 0 ? (
                    <span className="text-red-500">₹{patient.pending}</span>
                  ) : (
                    <span className="text-gray-400">Cleared</span>
                  )}
                </div>

                <div>
                  <button
                    onClick={() =>
                      navigate(`/billing/${patient.pid}`, {
                        state: patient,
                      })
                    }
                    className="text-blue-600 hover:text-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-500">No billing records found</p>

              <p className="text-sm text-gray-400 mt-1">
                Try searching with another patient name or PID
              </p>
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {filteredPatients.length > 0 ? (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.pid}
                  className="bg-white border border-gray-200 rounded-2xl p-5"
                >
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-500">Patient:</span>{" "}
                      <span className="text-slate-700 font-medium">
                        {patient.pname}
                      </span>
                    </p>

                    <p className="text-gray-600">PID: {patient.pid}</p>

                    <p className="text-gray-600">Total: ₹{patient.total}</p>

                    <p className="text-green-600">Paid: ₹{patient.paid}</p>

                    <p
                      className={
                        patient.pending > 0 ? "text-red-500" : "text-gray-400"
                      }
                    >
                      {patient.pending > 0
                        ? `Pending: ₹${patient.pending}`
                        : "Cleared"}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/billing/${patient.pid}`, {
                        state: patient,
                      })
                    }
                    className="mt-4 text-blue-600 hover:text-blue-700"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl py-12 text-center">
              <p className="text-lg text-gray-500">No billing records found</p>

              <p className="text-sm text-gray-400 mt-1">
                Try searching with another patient name or PID
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
