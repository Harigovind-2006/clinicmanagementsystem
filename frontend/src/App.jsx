import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import NursePage from './pages/NursePage/NursePage';
import './App.css'
import PatientDashboard from './pages/NursePage/PatientDashboard';
import SeniorDoctor from "./pages/SeniorDoctor/SeniorDoctor"
import SeniorDashboard from './pages/SeniorDoctor/SeniorDashboard';
function App() {

  return (
    <Routes> 
      <Route path="/nurse" element={<NursePage />} />
      <Route path="/patient/:pid" element={<PatientDashboard />} />
      <Route path="/sdoctor" element={<SeniorDoctor/>} />
      <Route path="/patients/:pid" element={<SeniorDashboard />} /> 
    </Routes>
  )
}

export default App
