import { useState } from 'react';
import { Plus, Search, Edit2 } from 'lucide-react';
import Layout from './Layout';

const active = [
  { id: 1, pid: 'P001', patientName: 'John Doe', tokenNumber: 23, assignedDoctorName: 'Dr. Smith', specialization: 'Cardiology', appointmentTime: '10:30 AM', status: 'Scheduled', createdAt: '2024-06-01 09:00' },
  { id: 2, pid: 'P002', patientName: 'Jane Smith', tokenNumber: 24, assignedDoctorName: 'Dr. Adams', specialization: 'Neurology', appointmentTime: '11:00 AM', status: 'Waiting', createdAt: '2024-06-01 09:30' },
  { id: 3, pid: 'P003', patientName: 'Alice Johnson', tokenNumber: 25, assignedDoctorName: 'Dr. Brown', specialization: 'Orthopedics', appointmentTime: '11:30 AM', status: 'In Progress', createdAt: '2024-06-01 10:00' },
  { id: 4, pid: 'P004', patientName: 'Bob Williams', tokenNumber: 26, assignedDoctorName: 'Dr. Davis', specialization: 'Dermatology', appointmentTime: '12:00 PM', status: 'Completed', createdAt: '2024-06-01 10:30' },
  { id: 5, pid: 'P005', patientName: 'Charlie Brown', tokenNumber: 27, assignedDoctorName: 'Dr. Miller', specialization: 'Pediatrics', appointmentTime: '12:30 PM', status: 'Scheduled', createdAt: '2024-06-01 11:00' },
]

const dischargeRequests = [
  { id: 1, patientPid: 'P001', roomId: 101, fromDate: '2024-05-25', toDate: '2024-06-01' },
  { id: 2, patientPid: 'P002', roomId: 102, fromDate: '2024-05-28', toDate: '2024-06-01' },
]

const statusColors = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Waiting: 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-green-100 text-green-700',
  Completed: 'bg-gray-100 text-gray-600',
}

const roomMap = {
  101: { name: 'Room 101' },
  102: { name: 'Room 102' },
}

const patientNames = {
  P001: 'John Doe',
  P002: 'Jane Smith',
  P003: 'Alice Johnson',
  P004: 'Bob Williams',
  P005: 'Charlie Brown',
}

const dischargePatientBills = {
  P001: { total: 7200, paid: 5200 },
  P002: { total: 6400, paid: 5700 },
}

const existingPatients = [
  { pid: 'P001', name: 'John Doe', phone: '9001234567', lastVisit: '2026-05-20' },
  { pid: 'P002', name: 'Jane Smith', phone: '9002345678', lastVisit: '2026-06-16' },
  { pid: 'P003', name: 'Ravi Kumar', phone: '9003456789', lastVisit: '2026-06-01' },
  { pid: 'P004', name: 'Priya Nair', phone: '9004567890', lastVisit: '2026-04-10' },
  { pid: 'P005', name: 'Suresh Rao', phone: '9005678901', lastVisit: '2026-06-05' },
]

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM',
]

export default function ManagerDashboard({ role }) {
  const [tab, setTab] = useState('appointments')
  const [search, setSearch] = useState('')
  const [appointments, setAppointments] = useState(active)
  const [editAppt, setEditAppt] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isNewAppointmentWizard, setIsNewAppointmentWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [patientMode, setPatientMode] = useState('new')
  const [existingPatientSearch, setExistingPatientSearch] = useState('')
  const [newAppointmentData, setNewAppointmentData] = useState({
    id: null,
    pid: '',
    patientName: '',
    dob: '',
    phone: '',
    email: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    specialization: 'Cardiology',
    assignedDoctorName: 'Dr. Smith',
    appointmentDate: new Date().toISOString().slice(0, 10),
    appointmentTime: '9:00 AM',
    paymentMethod: 'Cash',
  })
  const [selectedDischarge, setSelectedDischarge] = useState(null)
  
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [confirmedAppointment, setConfirmedAppointment] = useState(null)

  const doctorOptions = ['Dr. Smith', 'Dr. Adams', 'Dr. Brown', 'Dr. Davis', 'Dr. Miller', 'Dr. Amit Sharma']
  const specializations = ['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Pediatrics']

  const filtered = appointments.filter((a) => {
    const query = search.toLowerCase()
    return (
      a.pid.toLowerCase().includes(query) ||
      a.patientName.toLowerCase().includes(query) ||
      a.assignedDoctorName.toLowerCase().includes(query) ||
      a.specialization.toLowerCase().includes(query) ||
      a.tokenNumber.toString().includes(query)
    )
  })

  const getDischargePatientBills = (patientPid) => {
    const bill = dischargePatientBills[patientPid] || { total: 0, paid: 0 }
    const pending = Math.max(0, bill.total - bill.paid)
    return { total: bill.total, paid: bill.paid, pending }
  }

  const getRoom = (roomId) => roomMap[roomId] || null
  const getPatientName = (patientPid) => patientNames[patientPid] || patientPid

  const openEditModal = (appointment) => {
    setEditAppt({ ...appointment })
    setShowModal(true)
  }

  const openNewAppointmentModal = () => {
    const date = new Date().toISOString().slice(0, 10)
    setNewAppointmentData({
      id: Date.now(),
      pid: `P00${appointments.length + 1}`,
      patientName: '',
      dob: '',
      phone: '',
      email: '',
      gender: 'Male',
      bloodGroup: 'O+',
      address: '',
      specialization: specializations[0],
      assignedDoctorName: doctorOptions[0],
      appointmentDate: date,
      appointmentTime: '9:00 AM',
      paymentMethod: 'Cash',
    })
    setWizardStep(1)
    setIsNewAppointmentWizard(true)
    setShowModal(true)
  }

  const saveAppointment = () => {
    if (!editAppt) return
    setAppointments((prev) => {
      const exists = prev.some((item) => item.id === editAppt.id)
      if (exists) {
        return prev.map((item) => (item.id === editAppt.id ? editAppt : item))
      }
      return [...prev, editAppt]
    })
    setShowModal(false)
  }

  const saveNewAppointment = () => {
    const newAppointment = {
      id: newAppointmentData.id,
      pid: newAppointmentData.pid,
      patientName: newAppointmentData.patientName,
      tokenNumber: appointments.length + 1,
      assignedDoctorName: newAppointmentData.assignedDoctorName,
      specialization: newAppointmentData.specialization,
      appointmentTime: newAppointmentData.appointmentTime,
      status: 'Scheduled',
      createdAt: `${newAppointmentData.appointmentDate} ${newAppointmentData.appointmentTime}`,
    }

    setAppointments((prev) => [...prev, newAppointment])

    setConfirmedAppointment({
      ...newAppointment,
      amount: 700,
      bookedOn: new Date().toISOString().split('T')[0],
    })

    setShowModal(false)
    setIsNewAppointmentWizard(false)
    setShowSuccessModal(true)
  }

  const appointmentDate = editAppt?.createdAt?.split(' ')[0] || ''

  return (
    <Layout>
      {/* Wrapper added to create space from the sidebar and give general breathing room */}
      <div className="pl-8 md:pl-12 pr-6 py-8 w-full max-w-7xl mx-auto">
        
        {/* Changed from items-center to items-start to allow the button to move down relative to the text */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-gray-900 text-3xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={openNewAppointmentModal}
            className="mt-3 flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-blue-700 font-medium shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> New Appointment
          </button>
        </div>

        <div className="flex gap-0 border border-gray-200 rounded-lg overflow-hidden mb-5 w-fit bg-white">
          <button
            onClick={() => setTab('appointments')}
            className={`px-6 py-2.5 text-sm font-medium transition-colors ${tab === 'appointments' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setTab('ip-discharge')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-colors ${tab === 'ip-discharge' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            IP Discharge
            {dischargeRequests.length > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                {dischargeRequests.length}
              </span>
            )}
          </button>
        </div>

        {tab === 'appointments' && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                placeholder="Search by token, PID, name or doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm focus:outline-none"
              />
              <span className="text-xs text-gray-400 font-medium">{filtered.length} appointments</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Token', 'PID', 'Patient Name', 'Doctor', 'Specialization', 'Time', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs text-gray-500 font-semibold uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="text-gray-900 font-bold">#{a.tokenNumber}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 font-medium">{a.pid}</td>
                      <td className="px-5 py-4 text-gray-900 font-medium">{a.patientName}</td>
                      <td className="px-5 py-4 text-gray-700">{a.assignedDoctorName}</td>
                      <td className="px-5 py-4 text-gray-500">{a.specialization}</td>
                      <td className="px-5 py-4 text-gray-500">
                        <div className="font-medium text-gray-700">{a.appointmentTime}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{a.createdAt.split(' ')[0]}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[a.status] || 'bg-gray-100 text-gray-700'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => openEditModal(a)}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                        No appointments found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'ip-discharge' && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200">
              <span className="text-sm text-gray-500 font-medium">Patients awaiting discharge clearance</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Patient', 'PID', 'Room', 'Admitted', 'Total Bill', 'Paid', 'Pending', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs text-gray-500 font-semibold uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dischargeRequests.map((adm) => {
                    const { total, paid, pending } = getDischargePatientBills(adm.patientPid)
                    const room = getRoom(adm.roomId)
                    return (
                      <tr key={adm.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 text-gray-900 font-medium">{getPatientName(adm.patientPid)}</td>
                        <td className="px-5 py-4 text-gray-500 font-medium">{adm.patientPid}</td>
                        <td className="px-5 py-4 text-gray-500">{room?.name || '—'}</td>
                        <td className="px-5 py-4 text-gray-500">{adm.fromDate}</td>
                        <td className="px-5 py-4 text-gray-900 font-medium">Rs. {total}</td>
                        <td className="px-5 py-4 text-green-600 font-semibold">Rs. {paid}</td>
                        <td className="px-5 py-4 text-red-600 font-semibold">Rs. {pending}</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelectedDischarge(adm)}
                            className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-100 font-semibold transition-colors"
                          >
                            View & Discharge
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {dischargeRequests.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                        No discharge requests currently pending.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && isNewAppointmentWizard && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${wizardStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>1</span>
                <span className={wizardStep === 1 ? 'text-slate-900 font-semibold text-sm' : 'text-slate-400 text-sm'}>Patient Details</span>
              </div>
              <div className="h-px w-16 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${wizardStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>2</span>
                <span className={wizardStep === 2 ? 'text-slate-900 font-semibold text-sm' : 'text-slate-400 text-sm'}>Doctor Scheduling</span>
              </div>
              <div className="h-px w-16 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${wizardStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>3</span>
                <span className={wizardStep === 3 ? 'text-slate-900 font-semibold text-sm' : 'text-slate-400 text-sm'}>Payment</span>
              </div>
              <button onClick={() => setShowModal(false)} className="ml-auto text-slate-400 hover:text-slate-700 text-2xl leading-none">&times;</button>
            </div>

            {wizardStep === 1 && (
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <button
                    type="button"
                    onClick={() => setPatientMode('new')}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${patientMode === 'new' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                  >
                    New Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatientMode('existing')}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${patientMode === 'existing' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                  >
                    Existing Patient
                  </button>
                </div>

                {patientMode === 'new' ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 flex flex-col">
                      <span className="text-sm font-medium text-slate-700">Full Name</span>
                      <input
                        value={newAppointmentData.patientName}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, patientName: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </label>
                    <label className="space-y-2 flex flex-col">
                      <span className="text-sm font-medium text-slate-700">Phone</span>
                      <input
                        value={newAppointmentData.phone}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </label>
                    <label className="space-y-2 flex flex-col">
                      <span className="text-sm font-medium text-slate-700">Date of Birth</span>
                      <input
                        type="date"
                        value={newAppointmentData.dob}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, dob: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </label>
                    <label className="space-y-2 flex flex-col">
                      <span className="text-sm font-medium text-slate-700">Email</span>
                      <input
                        type="email"
                        value={newAppointmentData.email}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </label>
                    <label className="space-y-2 flex flex-col">
                      <span className="text-sm font-medium text-slate-700">Gender</span>
                      <select
                        value={newAppointmentData.gender}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, gender: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                    <label className="space-y-2 flex flex-col">
                      <span className="text-sm font-medium text-slate-700">Blood Group</span>
                      <select
                        value={newAppointmentData.bloodGroup}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, bloodGroup: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        <option>O+</option>
                        <option>A+</option>
                        <option>B+</option>
                        <option>AB+</option>
                        <option>O-</option>
                      </select>
                    </label>
                    <label className="md:col-span-2 space-y-2 flex flex-col">
                      <span className="text-sm font-medium text-slate-700">Postal Address</span>
                      <input
                        value={newAppointmentData.address}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, address: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      value={existingPatientSearch}
                      onChange={(e) => setExistingPatientSearch(e.target.value)}
                      placeholder="Search by PID or Name..."
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
                          <tr>
                            <th className="px-4 py-3 text-left text-slate-500 font-semibold">PID</th>
                            <th className="px-4 py-3 text-left text-slate-500 font-semibold">Name</th>
                            <th className="px-4 py-3 text-left text-slate-500 font-semibold">Phone</th>
                            <th className="px-4 py-3 text-left text-slate-500 font-semibold">Last Visit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {existingPatients
                            .filter((patient) => {
                              const query = existingPatientSearch.toLowerCase()
                              return (
                                patient.pid.toLowerCase().includes(query) ||
                                patient.name.toLowerCase().includes(query)
                              )
                            })
                            .map((patient) => {
                              const isSelected = newAppointmentData.pid === patient.pid
                              return (
                                <tr
                                  key={patient.pid}
                                  onClick={() => {
                                    setNewAppointmentData({
                                      ...newAppointmentData,
                                      pid: patient.pid,
                                      patientName: patient.name,
                                      phone: patient.phone,
                                    })
                                  }}
                                  className={`cursor-pointer border-t border-slate-100 hover:bg-slate-50 transition ${isSelected ? 'bg-blue-50 hover:bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                                >
                                  <td className="px-4 py-3 font-medium text-slate-900">{patient.pid}</td>
                                  <td className="px-4 py-3 text-slate-700">{patient.name}</td>
                                  <td className="px-4 py-3 text-slate-600">{patient.phone}</td>
                                  <td className="px-4 py-3 text-slate-500">{patient.lastVisit}</td>
                                </tr>
                              )
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {wizardStep === 2 && (
              <div>
                <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 border border-slate-100">
                  <span className="font-semibold text-slate-800">Patient:</span> {newAppointmentData.patientName || 'Unknown'} &nbsp; <span className="font-semibold text-slate-800 ml-4">PID:</span> {newAppointmentData.pid}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 flex flex-col">
                    <span className="text-sm font-medium text-slate-700">Specialization</span>
                    <select
                      value={newAppointmentData.specialization}
                      onChange={(e) => setNewAppointmentData({ ...newAppointmentData, specialization: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select specialization...</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2 flex flex-col">
                    <span className="text-sm font-medium text-slate-700">Doctor (optional)</span>
                    <select
                      value={newAppointmentData.assignedDoctorName}
                      onChange={(e) => setNewAppointmentData({ ...newAppointmentData, assignedDoctorName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Auto-assign (shortest queue)</option>
                      {doctorOptions.map((doctor) => (
                        <option key={doctor} value={doctor}>
                          {doctor}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2 flex flex-col">
                    <span className="text-sm font-medium text-slate-700">Appointment Date *</span>
                    <input
                      type="date"
                      value={newAppointmentData.appointmentDate}
                      onChange={(e) => setNewAppointmentData({ ...newAppointmentData, appointmentDate: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </label>
                </div>
                <div className="space-y-3 mt-5">
                  <span className="text-sm font-medium text-slate-700 block">Appointment Time Slot *</span>
                  <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setNewAppointmentData({ ...newAppointmentData, appointmentTime: slot })}
                        className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${newAppointmentData.appointmentTime === slot ? 'border-blue-600 bg-blue-600 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100'}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div>
                <div className="mb-4 rounded-xl bg-slate-50 px-5 py-4 text-sm text-slate-600 border border-slate-100">
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <span><span className="font-semibold text-slate-800">Patient:</span> {newAppointmentData.patientName || 'Unknown'}</span>
                    <span><span className="font-semibold text-slate-800">Doctor:</span> {newAppointmentData.assignedDoctorName || 'Auto-assign'}</span>
                    <span><span className="font-semibold text-slate-800">Spec:</span> {newAppointmentData.specialization || 'General Medicine'}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex justify-between text-sm text-slate-600 mb-3">
                    <span>Registration Fee</span>
                    <span className="font-medium">Rs. 200</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 mb-4">
                    <span>Consultation Fee</span>
                    <span className="font-medium">Rs. 500</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-100 pt-4 mt-2">
                    <span>Amount to Collect Now</span>
                    <span className="text-blue-600">Rs. 700</span>
                  </div>
                </div>
                <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-sm font-semibold text-slate-800 mb-3">Payment Method</div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {['Cash', 'UPI', 'Card'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setNewAppointmentData({ ...newAppointmentData, paymentMethod: method })}
                        className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${newAppointmentData.paymentMethod === method ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => {
                  if (wizardStep === 1) {
                    setShowModal(false)
                    setIsNewAppointmentWizard(false)
                  } else {
                    setWizardStep((prev) => prev - 1)
                  }
                }}
                className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                {wizardStep === 1 ? 'Cancel' : 'Back'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (wizardStep < 3) {
                    setWizardStep((prev) => prev + 1)
                  } else {
                    saveNewAppointment()
                  }
                }}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
              >
                {wizardStep < 3 ? 'Next' : 'Collect Payment & Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && !isNewAppointmentWizard && editAppt && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Edit Appointment</p>
                <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-4 py-2 text-sm text-slate-700">
                  <span className="font-bold text-slate-900">{editAppt.patientName || 'Unknown Patient'}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500 font-medium">PID: {editAppt.pid || '—'}</span>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 text-2xl leading-none p-1">&times;</button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 flex flex-col">
                <span className="text-sm font-medium text-slate-700">Specialization</span>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  value={editAppt.specialization}
                  onChange={(e) => setEditAppt({ ...editAppt, specialization: e.target.value })}
                >
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 flex flex-col">
                <span className="text-sm font-medium text-slate-700">Doctor (optional)</span>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  value={editAppt.assignedDoctorName}
                  onChange={(e) => setEditAppt({ ...editAppt, assignedDoctorName: e.target.value })}
                >
                  {doctorOptions.map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 flex flex-col">
                <span className="text-sm font-medium text-slate-700">Appointment Date *</span>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={appointmentDate}
                  onChange={(e) => {
                    setEditAppt({ ...editAppt, createdAt: `${e.target.value} ${editAppt.appointmentTime || '09:00'}` })
                  }}
                />
              </label>

              <div className="space-y-3">
                <span className="text-sm font-medium text-slate-700 block">Appointment Time Slot *</span>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setEditAppt({ ...editAppt, appointmentTime: slot, createdAt: `${appointmentDate || new Date().toISOString().slice(0, 10)} ${slot}` })
                      }}
                      className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${editAppt.appointmentTime === slot ? 'border-blue-600 bg-blue-600 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveAppointment}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && confirmedAppointment && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800">
                Appointment Confirmed
              </h2>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-slate-400 hover:text-slate-700 text-3xl p-1 leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-8 max-h-[75vh] overflow-y-auto">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow-inner">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h1 className="text-center text-4xl font-black mt-6 text-slate-900">
                Token #{confirmedAppointment.tokenNumber}
              </h1>

              <p className="text-center text-slate-500 mt-2 font-medium">
                Payment received — Appointment confirmed
              </p>

              <div className="mt-8 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-5 py-4 text-slate-700 font-bold border-b border-slate-200">
                  Receipt Details
                </div>

                <div className="divide-y divide-slate-100 text-sm">
                  <div className="flex justify-between px-5 py-3.5">
                    <span className="text-slate-500 font-medium">Patient</span>
                    <span className="font-bold text-slate-900">{confirmedAppointment.patientName}</span>
                  </div>

                  <div className="flex justify-between px-5 py-3.5">
                    <span className="text-slate-500 font-medium">PID</span>
                    <span className="font-bold text-slate-900">{confirmedAppointment.pid}</span>
                  </div>

                  <div className="flex justify-between px-5 py-3.5">
                    <span className="text-slate-500 font-medium">Doctor</span>
                    <span className="font-bold text-slate-900">{confirmedAppointment.assignedDoctorName}</span>
                  </div>

                  <div className="flex justify-between px-5 py-3.5">
                    <span className="text-slate-500 font-medium">Appointment Date</span>
                    <span className="font-bold text-slate-900">{confirmedAppointment.createdAt.split(' ')[0]}</span>
                  </div>

                  <div className="flex justify-between px-5 py-3.5">
                    <span className="text-slate-500 font-medium">Booked On</span>
                    <span className="font-bold text-slate-900">{confirmedAppointment.bookedOn}</span>
                  </div>

                  <div className="flex justify-between px-5 py-3.5">
                    <span className="text-slate-500 font-medium">Consultation Fee</span>
                    <span className="font-bold text-slate-900">Rs. 500</span>
                  </div>

                  <div className="flex justify-between px-5 py-4 bg-green-50/50 border-t border-green-100">
                    <span className="font-bold text-green-800">
                      Total Paid
                    </span>
                    <span className="font-black text-green-700 text-base">
                      Rs. {confirmedAppointment.amount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={() => window.print()}
                  className="border-2 border-slate-200 rounded-xl py-3 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all text-sm text-slate-700"
                >
                  Print Bill
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-bold transition-all text-sm shadow-md hover:shadow-lg"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}