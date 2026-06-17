import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import NursePage from './pages/NursePage/NursePage';
import './App.css'
import PatientDashboard from './pages/NursePage/PatientDashboard';
import SeniorDoctor from "./pages/SeniorDoctor/SeniorDoctor"
import SeniorDashboard from './pages/SeniorDoctor/SeniorDashboard';
import BillPayment from './components/BillComponent/BillPayment';
import BillDashboard from './components/BillComponent/BillDashboard';
function App() {
      const [billSummary, setBillSummary] = useState([
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
  // other patients...
]);
  return (
    <Routes> 
      <Route path='/bill' element={<BillPayment/>}/>
      <Route path="/nurse" element={<NursePage />} />
      <Route path="/patient/:pid" element={<PatientDashboard />} />
      <Route path="/sdoctor" element={<SeniorDoctor/>} />
      <Route path="/patients/:pid" element={<SeniorDashboard />} /> 
      <Route path="/billing/:pid" element={<BillDashboard />} /> 
    </Routes>
  )
}

export default App
