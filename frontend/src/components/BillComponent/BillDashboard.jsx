import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../Layout";

export default function BillDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const patient = location.state || {
    pid: "",
    pname: "",
    total: 0,
    paid: 0,
    pending: 0,
    transactions: [],
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [transactions, setTransactions] = useState(patient?.transactions || []);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [reference, setReference] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);

  const handleMarkPaid = (index) => {
    const updated = [...transactions];

    updated[index] = {
      ...updated[index],
      status: "Paid",
      method: paymentMethod,
      reference: paymentMethod === "Cash" ? "N/A" : reference || updated[index].reference,
    };

    setTransactions(updated);
  };

  const hasPending = transactions.some((t) => t.status === "Pending");

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/bill-payments")}
            className="text-blue-600 font-medium hover:text-blue-800"
          >
            Bills & Payments
          </button>

          <span className="text-gray-400">&gt;</span>

          <span className="font-medium text-slate-700">{patient.pname}</span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
            <p className="text-gray-500 text-sm mb-2">Total Amount</p>

            <p className="text-4xl font-medium text-slate-800">
              Rs. {patient.total}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <p className="text-gray-500 text-sm mb-2">Paid</p>

            <p className="text-4xl font-medium text-green-700">
              Rs. {patient.paid}
            </p>
          </div>

          <div
            className={`rounded-2xl p-6 text-center border ${
              patient.pending > 0
                ? "bg-red-50 border-red-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <p className="text-gray-500 text-sm mb-2">Pending / Balance</p>

            {patient.pending > 0 ? (
              <p className="text-4xl font-medium text-red-600">
                Rs. {patient.pending} due
              </p>
            ) : (
              <p className="text-4xl font-medium text-gray-400">Cleared</p>
            )}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-normal text-gray-600">
              All transactions for {patient.pname}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white">
                <tr className="text-gray-500 font-medium">
                  <th className="p-4 text-left">Purpose</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Method</th>
                  <th className="p-4 text-left">Reference</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Status</th>

                  {hasPending && <th className="p-4 text-left">Action</th>}
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-gray-200 text-gray-600"
                  >
                    <td className="p-4">{transaction.purpose}</td>

                    <td className="p-4">₹{transaction.amount}</td>

                    <td className="p-4">{transaction.method}</td>

                    <td className="p-4">{transaction.reference}</td>

                    <td className="p-4">{transaction.date}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-md text-xs ${
                          transaction.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    {hasPending && (
                      <td className="p-4">
                        {transaction.status === "Pending" && (
                          <button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setSelectedIndex(index);
                              setReference("");
                              setPaymentMethod("Cash");
                              setShowPaymentModal(true);
                            }}
                            className="px-4 py-2 rounded-lg border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 transition"
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="bg-white rounded-2xl shadow-sm p-5"
            >
              <div className="space-y-2">
                <p>
                  <strong>Purpose:</strong> {transaction.purpose}
                </p>

                <p>
                  <strong>Amount:</strong> ₹{transaction.amount}
                </p>

                <p>
                  <strong>Method:</strong> {transaction.method}
                </p>

                <p>
                  <strong>Reference:</strong> {transaction.reference}
                </p>

                <p>
                  <strong>Date:</strong> {transaction.date}
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                    transaction.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction.status}
                </span>
              </div>

              {transaction.status === "Pending" && (
                <button
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setSelectedIndex(index);
                    setReference("");
                    setPaymentMethod("Cash");
                    setShowPaymentModal(true);
                  }}
                  className="w-full mt-4 px-4 py-2 rounded-lg border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 transition"
                >
                  Mark Paid
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="flex justify-between items-center px-7 py-5 border-b border-gray-200">
                <h3 className="text-xl font-semibold">Mark Payment</h3>

                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-500 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="p-7">
                <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-500">Patient</span>
                    <strong>{patient.pname}</strong>
                  </div>

                  <div className="flex justify-between mb-3">
                    <span className="text-gray-500">Purpose</span>
                    <strong>{selectedTransaction?.purpose}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <strong>₹{selectedTransaction?.amount}</strong>
                  </div>
                </div>

                <label className="block mb-2 font-medium text-gray-700">Payment Method</label>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Card</option>
                </select>

                {/* Hide reference input completely when Cash is selected */}
                {paymentMethod !== "Cash" && (
                  <div className="mt-5">
                    <label className="block mb-2 text-gray-700 font-medium">
                      Reference
                    </label>

                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder={
                        paymentMethod === "UPI"
                          ? "UPI Transaction ID"
                          : "Card last 4 digits"
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="border px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      handleMarkPaid(selectedIndex);
                      setShowPaymentModal(false);
                      setShowSuccess(true);
                      setTimeout(() => {
                        setShowSuccess(false);
                      }, 2000); // Strict 2-second timeout
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clean Slide down / Slide up Success Popup */}
        <div
          className={`fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none transition-all duration-300 transform ${
            showSuccess ? "translate-y-10 opacity-100" : "-translate-y-full opacity-0"
          }`}
        >
          <div className="bg-white shadow-2xl border border-gray-100 rounded-3xl p-6 text-center min-w-[340px] pointer-events-auto">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800">Payment Successful</h3>
            <p className="text-gray-500 text-sm mt-1">Payment has been recorded.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}