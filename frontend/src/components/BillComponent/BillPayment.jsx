import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import api from "../../api/axios";

export default function BillPayment() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [billSummary, setBillSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // Fetch all patients
      const patientRes = await api.get("/patientapi");
      const patients = patientRes.data.data || patientRes.data;

      // Fetch invoice for each patient
      const bills = await Promise.all(
        patients.map(async (patient) => {
          try {
            const invoiceRes = await api.get(
              `/patientapi/${patient._id}/invoice`
            );

            const invoice = invoiceRes.data.invoice || invoiceRes.data;

            return {
              _id: patient._id,
              pid: patient.pid,
              pname: patient.name,
              total: invoice.totalBillAmount || 0,
              paid: invoice.totalAmountPaid || 0,
              pending: invoice.totalAmountDue || 0,
              transactions: invoice.invoiceItems || [],
            };
          } catch (error) {
            // Patient has no invoice yet
            return {
              _id: patient._id,
              pid: patient.pid,
              pname: patient.name,
              total: 0,
              paid: 0,
              pending: 0,
              transactions: [],
            };
          }
        })
      );

      // Filter out patients with no bills (optional - remove if you want to show all)
      const billsWithTransactions = bills.filter(
        (bill) => bill.transactions.length > 0 || bill.total > 0
      );

      setBillSummary(billsWithTransactions);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setErrorMsg("Failed to load billing records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter patients based on search
  const filteredPatients = billSummary.filter(
    (patient) =>
      patient.pname?.toLowerCase().includes(search.toLowerCase()) ||
      patient.pid?.toLowerCase().includes(search.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading billing records...</p>
          </div>
        </div>
      </Layout>
    );
  }

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

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg("")}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

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
                key={patient._id || patient.pid}
                className="grid grid-cols-6 px-6 py-4 border-t border-gray-200 items-center hover:bg-gray-50/50 transition-colors"
              >
                <div className="text-slate-700 font-medium">
                  {patient.pname}
                </div>

                <div className="text-gray-500">{patient.pid}</div>

                <div className="text-gray-600">₹{patient.total}</div>

                <div className="text-green-600">₹{patient.paid}</div>

                <div>
                  {patient.pending > 0 ? (
                    <span className="text-red-500 font-medium">
                      ₹{patient.pending}
                    </span>
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
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-500">No billing records found</p>

              <p className="text-sm text-gray-400 mt-1">
                {search
                  ? "Try searching with another patient name or PID"
                  : "No patients have billing records yet"}
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
                  key={patient._id || patient.pid}
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
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
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl py-12 text-center">
              <p className="text-lg text-gray-500">No billing records found</p>

              <p className="text-sm text-gray-400 mt-1">
                {search
                  ? "Try searching with another patient name or PID"
                  : "No patients have billing records yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}