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
      {/*<Route path="/" element={<NursePage />} />
      <Route path="/patient/:pid" element={<PatientDashboard />} />*/}
      <Route path="/" element={<SeniorDoctor/>} />
      <Route path="/patient/:pid" element={<SeniorDashboard />} /> 
    </Routes>
  )
}

export default App
