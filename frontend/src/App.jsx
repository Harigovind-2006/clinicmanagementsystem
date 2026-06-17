import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NursePage from "./pages/NursePage/NursePage";
import "./App.css";
import PatientDashboard from "./pages/NursePage/PatientDashboard";
import SeniorDoctor from "./pages/SeniorDoctor/SeniorDoctor";
import SeniorDashboard from "./pages/SeniorDoctor/SeniorDashboard";
import BillPayment from "./components/BillComponent/BillPayment";
import BillDashboard from "./components/BillComponent/BillDashboard";
import Admission from "./components/AdmissionComponent/Admission"
function App() {
  return (
    <Routes>
      <Route path="/bill" element={<BillPayment />} />
      <Route path="/nurse" element={<NursePage />} />
      <Route path="/patient/:pid" element={<PatientDashboard />} />
      <Route path="/sdoctor" element={<SeniorDoctor />} />
      <Route path="/patients/:pid" element={<SeniorDashboard />} />
      <Route path="/billing/:pid" element={<BillDashboard />} />
      <Route path="/admission" element={<Admission />} />
    </Routes>
  );
}

export default App;
