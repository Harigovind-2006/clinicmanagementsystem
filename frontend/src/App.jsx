import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landingpage from './pages/Landingpage/Landingpage'
import NursePage from './pages/NursePage/NursePage'
import PatientDashboard from './pages/NursePage/PatientDashboard'
import Demo from './pages/demo'
import './App.css'

function getDefaultPage(role) {
  // simple placeholder: decide initial page per role
  switch (role) {
    case 'Manager':
    case 'Front Office Staff':
    case 'Senior Doctor':
    case 'Junior Doctor':
      return 'dashboard';
    case 'Nurse': return 'rooms';
    case 'Pharmacist': return 'patientMedicines';
    default: return 'dashboard';
  }
}

function RoleDashboard({ role, onLogout }) {
  const [page, setPage] = useState(getDefaultPage(role))

  const renderContent = () => {
    switch (role) {
      case 'Manager':
        switch (page) {
          case 'dashboard': return <ManagerDashboard role={role} />;
          case 'patients': return <PatientsPage role={role} />;
          case 'admissions': return <AdmissionsPage />;
          case 'bills': return <BillsPage role={role} />;
          case 'medicines': return <MedicinesPage />;
          case 'users': return <UsersPage />;
          default: return <ManagerDashboard role={role} />;
        }
      case 'Front Office Staff':
        switch (page) {
          case 'dashboard': return <ManagerDashboard role={role} />;
          case 'patients': return <PatientsPage role={role} />;
          case 'admissions': return <AdmissionsPage />;
          case 'bills': return <BillsPage role={role} />;
          default: return <ManagerDashboard role={role} />;
        }
      case 'Senior Doctor':
        return <SeniorDoctorView page={page} />;
      case 'Junior Doctor':
        return <JuniorDoctorView page={page} />;
      case 'Nurse':
        return <NurseView page={page} />;
      case 'Pharmacist':
        return <PharmacistView page={page} />;
      default:
        return <div className="text-gray-400">Unknown role</div>;
    }
  };

  return (
    <Layout role={role} currentPage={page} onNavigate={setPage} onLogout={onLogout}>
      {renderContent()}
    </Layout>
  )
}

function App() {
  const [role, setRole] = useState<Role | null>(null);

  return (
    role ? (
        <RoleDashboard role={role} onLogout={() => setRole(null)} />
      ) : (
        <LandingPage onContinue={setRole} />
      )
  )
}

export default App




// <Routes>
    //   <Route path="/" element={<Landingpage />} />
    //   <Route path="/demo" element={<Demo />} />
    //   <Route path="/nurse" element={<NursePage />} />
    //   <Route path="/patient" element={<PatientDashboard />} />
    // </Routes>