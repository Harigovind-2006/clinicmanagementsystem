import { Routes, Route } from "react-router-dom";

import Landingpage from "./pages/Landingpage/Landingpage";

import Dashboard from "./components/Dashboard";

import NursePage from "./pages/NursePage/NursePage";
import PatientDashboard from "./pages/NursePage/PatientDashboard";

import JuniorDoctor from "./pages/JuniorDoctor/JuniorDoctor";
import PatientAssessment from "./pages/JuniorDoctor/PatientAssessment";

import PharmacistPage from "./pages/Pharmacist/PharmacistPage";
import PrescriptionDispensing from "./pages/Pharmacist/PrescriptionDispensing";
import DispensingConfirmation from "./pages/Pharmacist/DispensingConfirmation";

import MedicineInventory from "./components/MedicineInventory";

import SeniorDoctorDashboard from "./pages/SeniorDoctor/SeniorDoctorDashboard";
import SeniorDoctorConsultation from "./pages/SeniorDoctor/SeniorDoctorConsultation";

import BillPayment from "./components/BillComponent/BillPayment";
import BillDashboard from "./components/BillComponent/BillDashboard";
import Admission from "./components/AdmissionComponent/Admission";

import Users from "./components/Users";
import PharmacyBill from "./pages/Pharmacist/PharmacyBill";

import PatientsList from "./components/PatientComponent/PatientsList";
import PatientProfile from "./components/PatientComponent/PatientsProfile";
import PatientHistory from "./components/PatientComponent/PatientHistory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/nurse" element={<NursePage />} />
      <Route path="/patient/:pid" element={<PatientDashboard />} />

      <Route path="/junior-doctor" element={<JuniorDoctor />} />
      <Route path="/assessment/:pid" element={<PatientAssessment />} />

      <Route path="/pharmacist" element={<PharmacistPage />} />

      <Route
        path="/pharmacist/prescriptions/:id"
        element={<PrescriptionDispensing />}
      />

      <Route
        path="/pharmacist/prescriptions/:id/success"
        element={<DispensingConfirmation />}
      />

      <Route path="/medicine-inventory" element={<MedicineInventory />} />

      <Route path="/senior-doctor" element={<SeniorDoctorDashboard />} />

      <Route
        path="/senior-dashboard/:pid"
        element={<SeniorDoctorConsultation />}
      />

      <Route path="/bill-payments" element={<BillPayment />} />

      <Route path="/billing/:pid" element={<BillDashboard />} />

      <Route path="/admission" element={<Admission />} />

      <Route path="/pharmacy-bill" element={<PharmacyBill />} />

      <Route path="/users" element={<Users />} />

      <Route path="/patients" element={<PatientsList />} />
      <Route path="/patients/:pid" element={<PatientProfile />} />

      <Route path="/patient-history/:pid" element={<PatientHistory />} />

      <Route
        path="*"
        element={<div className="p-10 text-center">Page Not Found</div>}
      />
    </Routes>
  );
}

export default App;
