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
  const [errorMsg, setErrorMsg] = useState(""); // Added error state for validation
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
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            Bills & Payments
          </button>
          <span className="text-gray-400">&gt;</span>
          <span className="font-medium text-slate-700">{patient.pname}</span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-gray-500 text-sm mb-2 font-medium uppercase tracking-wider">Total Amount</p>
            <p className="text-4xl font-semibold text-slate-800">
              Rs. {patient.total}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-gray-500 text-sm mb-2 font-medium uppercase tracking-wider">Paid</p>
            <p className="text-4xl font-semibold text-green-700">
              Rs. {patient.paid}
            </p>
          </div>

          <div
            className={`rounded-2xl p-6 text-center border shadow-sm ${
              patient.pending > 0
                ? "bg-red-50 border-red-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <p className="text-gray-500 text-sm mb-2 font-medium uppercase tracking-wider">Pending / Balance</p>
            {patient.pending > 0 ? (
              <p className="text-4xl font-semibold text-red-600">
                Rs. {patient.pending} <span className="text-xl font-medium">due</span>
              </p>
            ) : (
              <p className="text-4xl font-semibold text-gray-400">Cleared</p>
            )}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-700">
              All transactions for {patient.pname}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white border-b border-gray-200">
                <tr className="text-gray-500 font-semibold uppercase tracking-wider text-xs">
                  <th className="p-5">Purpose</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5">Method</th>
                  <th className="p-5">Reference</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Status</th>
                  {hasPending && <th className="p-5 text-right">Action</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-5 font-medium text-gray-900">{transaction.purpose}</td>
                    <td className="p-5 text-gray-700">₹{transaction.amount}</td>
                    <td className="p-5 text-gray-600">{transaction.method}</td>
                    <td className="p-5 text-gray-600">{transaction.reference}</td>
                    <td className="p-5 text-gray-500">{transaction.date}</td>
                    <td className="p-5">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                          transaction.status === "Paid"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    {hasPending && (
                      <td className="p-5 text-right">
                        {transaction.status === "Pending" && (
                          <button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setSelectedIndex(index);
                              setReference("");
                              setPaymentMethod("Cash");
                              setErrorMsg(""); // Reset error msg
                              setShowPaymentModal(true);
                            }}
                            className="px-4 py-2 rounded-lg border border-green-300 bg-green-50 text-green-700 font-medium hover:bg-green-100 transition-colors"
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
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
            >
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Purpose:</span>
                  <span className="font-semibold text-gray-900">{transaction.purpose}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium text-gray-900">₹{transaction.amount}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Method:</span>
                  <span className="text-gray-700">{transaction.method}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Reference:</span>
                  <span className="text-gray-700">{transaction.reference}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Date:</span>
                  <span className="text-gray-700">{transaction.date}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                      transaction.status === "Paid"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>

              {transaction.status === "Pending" && (
                <button
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setSelectedIndex(index);
                    setReference("");
                    setPaymentMethod("Cash");
                    setErrorMsg(""); // Reset error msg
                    setShowPaymentModal(true);
                  }}
                  className="w-full mt-5 px-4 py-2.5 rounded-xl border border-green-300 bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition-colors shadow-sm"
                >
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="flex justify-between items-center px-7 py-5 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Mark Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-7">
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Patient</span>
                    <strong className="text-gray-900">{patient.pname}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Purpose</span>
                    <strong className="text-gray-900">{selectedTransaction?.purpose}</strong>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-blue-100/50 text-base">
                    <span className="text-gray-600 font-medium">Amount Due</span>
                    <strong className="text-blue-700">₹{selectedTransaction?.amount}</strong>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setErrorMsg(""); // Clear errors when switching methods
                      }}
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>

                  {/* Conditionally render UPI Input */}
                  {paymentMethod === "UPI" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        UPI Transaction ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={reference}
                        onChange={(e) => {
                          setReference(e.target.value);
                          if (errorMsg) setErrorMsg("");
                        }}
                        placeholder="Enter 12-digit Ref ID"
                        className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 transition-shadow ${
                          errorMsg ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                        }`}
                      />
                      {errorMsg && <p className="text-red-500 text-xs mt-2 font-medium">{errorMsg}</p>}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="border border-gray-300 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Validation block
                      if (paymentMethod === "UPI" && !reference.trim()) {
                        setErrorMsg("UPI Transaction ID is required to proceed.");
                        return;
                      }

                      handleMarkPaid(selectedIndex);
                      setShowPaymentModal(false);
                      setShowSuccess(true);
                      setTimeout(() => {
                        setShowSuccess(false);
                      }, 2000);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
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
            <h3 className="text-lg font-bold text-gray-900">Payment Successful</h3>
            <p className="text-gray-500 text-sm mt-1 font-medium">Payment has been securely recorded.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}