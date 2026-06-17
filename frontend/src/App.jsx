import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import NursePage from './pages/NursePage/NursePage';
import './App.css'
import PatientDashboard from './pages/NursePage/PatientDashboard';
import SeniorDoctor from "./pages/SeniorDoctor/SeniorDoctor"
import SeniorDashboard from './pages/SeniorDoctor/SeniorDashboard';
import BillPayment from './components/BillPayment';
import BillDashboard from './components/BillDashboard';
function App() {

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
