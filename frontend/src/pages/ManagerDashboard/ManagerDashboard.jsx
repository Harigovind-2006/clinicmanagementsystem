import { useState } from 'react'
import { Plus, Search, Edit2 } from 'lucide-react'
import Layout from '../../components/Layout'

const active = [
  { id: 1, pid: 'P001', patientName: 'John Doe', tokenNumber: 23, assignedDoctorName: 'Dr. Smith', specialization: 'Cardiology', appointmentTime: '10:30 AM', status: 'Scheduled', createdAt: '2024-06-01 09:00', isFollowUp: false },
  { id: 2, pid: 'P002', patientName: 'Jane Smith', tokenNumber: 24, assignedDoctorName: 'Dr. Adams', specialization: 'Neurology', appointmentTime: '11:00 AM', status: 'Waiting', createdAt: '2024-06-01 09:30', isFollowUp: true },
  { id: 3, pid: 'P003', patientName: 'Alice Johnson', tokenNumber: 25, assignedDoctorName: 'Dr. Brown', specialization: 'Orthopedics', appointmentTime: '11:30 AM', status: 'In Progress', createdAt: '2024-06-01 10:00', isFollowUp: false },
  { id: 4, pid: 'P004', patientName: 'Bob Williams', tokenNumber: 26, assignedDoctorName: 'Dr. Davis', specialization: 'Dermatology', appointmentTime: '12:00 PM', status: 'Completed', createdAt: '2024-06-01 10:30', isFollowUp: false },
  { id: 5, pid: 'P005', patientName: 'Charlie Brown', tokenNumber: 27, assignedDoctorName: 'Dr. Miller', specialization: 'Pediatrics', appointmentTime: '12:30 PM', status: 'Follow-up', createdAt: '2024-06-01 11:00', isFollowUp: true },
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
  'Follow-up': 'bg-purple-100 text-purple-700',
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
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
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
    setAppointments((prev) => [
      ...prev,
      {
        id: newAppointmentData.id,
        pid: newAppointmentData.pid,
        patientName: newAppointmentData.patientName,
        tokenNumber: prev.length + 1,
        assignedDoctorName: newAppointmentData.assignedDoctorName,
        specialization: newAppointmentData.specialization,
        appointmentTime: newAppointmentData.appointmentTime,
        status: 'Scheduled',
        createdAt: `${newAppointmentData.appointmentDate} ${newAppointmentData.appointmentTime}`,
        isFollowUp: false,
      },
    ])
    setShowModal(false)
    setIsNewAppointmentWizard(false)
  }

  const appointmentDate = editAppt?.createdAt?.split(' ')[0] || ''

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
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
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> New Appointment
        </button>
      </div>

      <div className="flex gap-0 border border-gray-200 rounded-lg overflow-hidden mb-4 w-fit">
        <button
          onClick={() => setTab('appointments')}
          className={`px-5 py-2 text-sm transition-colors ${tab === 'appointments' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Appointments ({appointments.length})
        </button>
        <button
          onClick={() => setTab('ip-discharge')}
          className={`flex items-center gap-1.5 px-5 py-2 text-sm transition-colors ${tab === 'ip-discharge' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          IP Discharge
          {dischargeRequests.length > 0 && (
            <span className="bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">
              {dischargeRequests.length}
            </span>
          )}
        </button>
      </div>

      {tab === 'appointments' && (
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              placeholder="Search by token, PID, name or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm focus:outline-none"
            />
            <span className="text-xs text-gray-400">{filtered.length} appointments</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Token', 'PID', 'Patient Name', 'Doctor', 'Specialization', 'Time', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-gray-900">#{a.tokenNumber}</div>
                      {a.isFollowUp && <span className="text-xs text-purple-600">Follow-up</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{a.pid}</td>
                    <td className="px-4 py-3 text-gray-900">{a.patientName}</td>
                    <td className="px-4 py-3 text-gray-700">{a.assignedDoctorName}</td>
                    <td className="px-4 py-3 text-gray-500">{a.specialization}</td>
                    <td className="px-4 py-3 text-gray-500">
                      <div>{a.appointmentTime}</div>
                      <div className="text-xs text-gray-400">{a.createdAt.split(' ')[0]}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs ${statusColors[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEditModal(a)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'ip-discharge' && (
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="px-5 py-4 border-b border-gray-200">
            <span className="text-sm text-gray-500">Patients awaiting discharge clearance</span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Patient', 'PID', 'Room', 'Admitted', 'Total Bill', 'Paid', 'Pending', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500">
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
                  <tr key={adm.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{getPatientName(adm.patientPid)}</td>
                    <td className="px-4 py-3 text-gray-500">{adm.patientPid}</td>
                    <td className="px-4 py-3 text-gray-500">{room?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{adm.fromDate}</td>
                    <td className="px-4 py-3 text-gray-900">Rs. {total}</td>
                    <td className="px-4 py-3 text-green-600">Rs. {paid}</td>
                    <td className="px-4 py-3 text-red-600">Rs. {pending}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedDischarge(adm)}
                        className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-1 hover:bg-blue-100"
                      >
                        View & Discharge
                      </button>
                    </td>
                  </tr>
                )
              })}
              {dischargeRequests.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                    No discharge requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && isNewAppointmentWizard && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-4xl overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${wizardStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>1</span>
                <span className={wizardStep === 1 ? 'text-slate-900 font-semibold' : 'text-slate-400'}>Patient Details</span>
              </div>
              <div className="h-px w-16 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${wizardStep === 2 ? 'bg-blue-600 text-white' : wizardStep > 2 ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500'}`}>2</span>
                <span className={wizardStep === 2 ? 'text-slate-900 font-semibold' : 'text-slate-400'}>Doctor Scheduling</span>
              </div>
              <div className="h-px w-16 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${wizardStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>3</span>
                <span className={wizardStep === 3 ? 'text-slate-900 font-semibold' : 'text-slate-400'}>Payment</span>
              </div>
              <button onClick={() => setShowModal(false)} className="ml-auto text-slate-400 hover:text-slate-700 text-xl">×</button>
            </div>

            {wizardStep === 1 && (
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <button
                    type="button"
                    onClick={() => setPatientMode('new')}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${patientMode === 'new' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                  >
                    New Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatientMode('existing')}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${patientMode === 'existing' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                  >
                    Existing Patient
                  </button>
                </div>

                {patientMode === 'new' ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Full Name</span>
                      <input
                        value={newAppointmentData.patientName}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, patientName: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Phone</span>
                      <input
                        value={newAppointmentData.phone}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, phone: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Date of Birth</span>
                      <input
                        type="date"
                        value={newAppointmentData.dob}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, dob: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Email</span>
                      <input
                        type="email"
                        value={newAppointmentData.email}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, email: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Gender</span>
                      <select
                        value={newAppointmentData.gender}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, gender: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Blood Group</span>
                      <select
                        value={newAppointmentData.bloodGroup}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, bloodGroup: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option>O+</option>
                        <option>A+</option>
                        <option>B+</option>
                        <option>AB+</option>
                        <option>O-</option>
                      </select>
                    </label>
                    <label className="md:col-span-2 space-y-2">
                      <span className="text-sm font-medium text-slate-700">Postal Address</span>
                      <input
                        value={newAppointmentData.address}
                        onChange={(e) => setNewAppointmentData({ ...newAppointmentData, address: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      value={existingPatientSearch}
                      onChange={(e) => setExistingPatientSearch(e.target.value)}
                      placeholder="Search by PID or Name..."
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <div className="max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-slate-500">PID</th>
                            <th className="px-4 py-3 text-left text-slate-500">Name</th>
                            <th className="px-4 py-3 text-left text-slate-500">Phone</th>
                            <th className="px-4 py-3 text-left text-slate-500">Last Visit</th>
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
                            .map((patient) => (
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
                                className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                              >
                                <td className="px-4 py-3">{patient.pid}</td>
                                <td className="px-4 py-3">{patient.name}</td>
                                <td className="px-4 py-3">{patient.phone}</td>
                                <td className="px-4 py-3">{patient.lastVisit}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {wizardStep === 2 && (
              <div>
                <div className="mb-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <span className="font-semibold">Patient:</span> {newAppointmentData.patientName || 'Unknown'} &nbsp; PID: {newAppointmentData.pid}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Specialization</span>
                    <select
                      value={newAppointmentData.specialization}
                      onChange={(e) => setNewAppointmentData({ ...newAppointmentData, specialization: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select specialization...</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Doctor (optional)</span>
                    <select
                      value={newAppointmentData.assignedDoctorName}
                      onChange={(e) => setNewAppointmentData({ ...newAppointmentData, assignedDoctorName: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Auto-assign (shortest queue)</option>
                      {doctorOptions.map((doctor) => (
                        <option key={doctor} value={doctor}>
                          {doctor}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Appointment Date *</span>
                    <input
                      type="date"
                      value={newAppointmentData.appointmentDate}
                      onChange={(e) => setNewAppointmentData({ ...newAppointmentData, appointmentDate: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </label>
                </div>
                <div className="space-y-2 mt-4">
                  <span className="text-sm font-medium text-slate-700">Appointment Time Slot *</span>
                  <div className="grid gap-2 sm:grid-cols-4">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setNewAppointmentData({ ...newAppointmentData, appointmentTime: slot })}
                        className={`rounded-2xl border px-3 py-2 text-xs font-medium transition ${newAppointmentData.appointmentTime === slot ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
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
                <div className="mb-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <div className="flex flex-wrap gap-4">
                    <span>Patient: {newAppointmentData.patientName || 'Unknown'}</span>
                    <span>Doctor: {newAppointmentData.assignedDoctorName || 'Auto-assign'}</span>
                    <span>Spec: {newAppointmentData.specialization || 'General Medicine'}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-3">
                    <span>Registration Fee</span>
                    <span>Rs. 200</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 mb-3">
                    <span>Consultation Fee</span>
                    <span>Rs. 500</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-slate-900">
                    <span>Amount to Collect Now</span>
                    <span>Rs. 700</span>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-medium text-slate-700 mb-2">Payment Method</div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {['Cash', 'UPI', 'Card'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setNewAppointmentData({ ...newAppointmentData, paymentMethod: method })}
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${newAppointmentData.paymentMethod === method ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
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
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {wizardStep < 3 ? 'Next' : 'Collect Payment & Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && !isNewAppointmentWizard && editAppt && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-4xl overflow-hidden">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-slate-500">Edit Appointment</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
                  <span>{editAppt.patientName || 'Unknown Patient'}</span>
                  <span className="text-slate-400">PID: {editAppt.pid || '—'}</span>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 text-xl">×</button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Specialization</span>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
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

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Doctor (optional)</span>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
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

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Appointment Date *</span>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  value={appointmentDate}
                  onChange={(e) => {
                    setEditAppt({ ...editAppt, createdAt: `${e.target.value} ${editAppt.appointmentTime || '09:00'}` })
                  }}
                />
              </label>

              <div className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Appointment Time Slot *</span>
                <div className="grid gap-2 sm:grid-cols-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setEditAppt({ ...editAppt, appointmentTime: slot, createdAt: `${appointmentDate || new Date().toISOString().slice(0, 10)} ${slot}` })
                      }}
                      className={`rounded-2xl border px-3 py-2 text-xs font-medium transition ${editAppt.appointmentTime === slot ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveAppointment}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
