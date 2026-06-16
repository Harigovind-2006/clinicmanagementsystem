import { Routes, Route } from 'react-router-dom'
import Landingpage from './pages/Landingpage/Landingpage';
import NursePage from './pages/NursePage/NursePage';
import PatientDashboard from './pages/NursePage/PatientDashboard';
import JuniorDoctor from './pages/JuniorDoctor/JuniorDoctor';
import PatientAssessment from './pages/JuniorDoctor/PatientAssessment';
import PharmacistPage from './pages/Pharmacist/PharmacistPage';
import PrescriptionDispensing from './pages/Pharmacist/PrescriptionDispensing';
import DispensingConfirmation from './pages/Pharmacist/DispensingConfirmation';
import MedicineInventory from './components/MedicineInventory';
import SeniorDoctor from "./pages/SeniorDoctor/SeniorDoctor"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/nurse" element={<NursePage />} />
      <Route path="/junior-doctor" element={<JuniorDoctor />} />
      <Route path="/patient/:pid" element={<PatientDashboard />} />
      <Route path="/assessment/:pid" element={<PatientAssessment />}/>
      <Route path="/pharmacist" element={<PharmacistPage />} />
      <Route path="/pharmacist/prescriptions/:id"element={<PrescriptionDispensing />}/>
      <Route path="/pharmacist/prescriptions/:id/success" element={<DispensingConfirmation />}/>
      <Route path="/medicine-inventory" element={<MedicineInventory />} />
      <Route path="/senior-doctor" element={<SeniorDoctor/>} />
      <Route path="*" element={<div className="p-10 text-center">Page Not Found</div>} />
    </Routes>
  )
}

export default App