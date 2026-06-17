import React,{useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import "./Bills.css"
export default function BillDashboard() {
    const location = useLocation()
    const patient=location.state
    const navigate=useNavigate()
    const [transactions, setTransactions] = useState(
  patient.transactions
);

function handleMarkPaid(index) {
  const updated = [...transactions];

  updated[index] = {
    ...updated[index],
    status: "Paid",
  };

  setTransactions(updated);
}
  return (
    <>
    <header>
        <button onClick={()=>navigate("/bill")}>Bills&Payments</button><span>&gt;{patient.pname}</span>

    </header>
    <div className='card-container'>
        <div className='total-card'>
            <h1>Total Amount</h1>
            <h1>{patient.total}</h1>
        </div>
        <div className='paid-card'>
            <h1>Paid</h1>
            <h1>{patient.paid}</h1>
        </div>
        <div className='balance-card'>
            <h1>Pending/Balance</h1>
            <h1>{patient.pending}</h1>
        </div>

    </div>
    <div className='table-container'>
        <h1>All Transaction for {patient.pname}</h1>
        <table>
            <thead>
                <tr>
                    <th>Purpose</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Paid</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
  {transactions.map((transaction, index) => (
    <tr key={transaction.id}>
      <td>{transaction.purpose}</td>
      <td>Rs. {transaction.amount}</td>
      <td>{transaction.method}</td>
      <td>{transaction.reference}</td>
      <td>{transaction.date}</td>

      <td>{transaction.status}</td>

      <td>
        {transaction.status === "Pending" ? (
          <button
            className="mark-paid-btn"
            onClick={() => handleMarkPaid(index)}
          >
            Mark Paid
          </button>
        ) : (
          "-"
        )}
      </td>
    </tr>
  ))}
</tbody>
        </table>
    </div>
    </>
  )
}
