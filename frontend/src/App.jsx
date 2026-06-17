import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landingpage from './pages/Landingpage/Landingpage';
import NursePage from './pages/NursePage/NursePage';
import PatientDashboard from './pages/NursePage/PatientDashboard';
import JuniorDoctor from './pages/JuniorDoctor/JuniorDoctor';
import PatientAssessment from './pages/JuniorDoctor/PatientAssessment';
import ManagerDashboard from './pages/ManagerDashboard/ManagerDashboard';
import Users from './components/Users';
import './App.css'
function App() {
  const role='Manager';
  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/nurse" element={<NursePage />} />
      <Route path="/junior-doctor" element={<JuniorDoctor />} />
      <Route path="/patient/:pid" element={<PatientDashboard />} />
      <Route
        path="/assessment/:pid"
        element={<PatientAssessment />}
        />
      <Route path="/ManagerDashboard" element={<ManagerDashboard role={role}/>}/>
      <Route path = "/Users" element = {<Users />} />   
    </Routes>
  )
}

export default App