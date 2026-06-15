import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landingpage from './pages/Landingpage/Landingpage';
import NursePage from './pages/NursePage/NursePage';
import PatientDashboard from './pages/NursePage/PatientDashboard';
import Demo from './pages/demo';
import './App.css'
function App() {

  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/nurse" element={<NursePage />} />
      <Route path="/patient" element={<PatientDashboard />} />
    </Routes>
  )
}

export default App