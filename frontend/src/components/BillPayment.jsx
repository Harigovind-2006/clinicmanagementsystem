import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Bills.css"
export default function BillPayment() {
    const navigate = useNavigate()
  const [data, setData] = useState("");
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
    patient.pname
      .toLowerCase()
      .includes(data.toLowerCase()) ||
    patient.pid
      .toLowerCase()
      .includes(data.toLowerCase())
);
  return (
    <>
      <header>
        <h1>Bills & Payments</h1>
      </header>
      <div>
        <div className="search-bar">
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
            <th>Patient</th>
            <th>PID</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Pending</th> 
            <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.pid}>
                <td>{patient.pname}</td>
                <td>{patient.pid}</td>

                <td>Rs. {patient.total}</td>

                <td className="paid-amount">Rs. {patient.paid}</td>

                <td
                  className={
                    patient.pending > 0 ? "pending-amount" : "cleared-status"
                  }
                >
                  {patient.pending > 0 ? `Rs. ${patient.pending}` : "Cleared"}
                </td>

                <td>
                  <button
                    className="view-details-btn"
                    onClick={() =>
  navigate(`/billing/${patient.pid}`, {
    state: patient,
  })
}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
