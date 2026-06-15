import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landingpage from './pages/Landingpage/Landingpage';
import Demo from './pages/demo';
import './App.css'
function App() {

  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/demo" element={<Demo />} />
    </Routes>
  )
}

export default App
