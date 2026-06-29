import { useState, useEffect } from "react";
import { Plus, Search, Check, Printer, Edit2, X, Clock } from "lucide-react";
import Layout from "./Layout";
import api from "../api/axios";

const todayDate = new Date().toISOString().split("T")[0];

const specializationsList = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Dermatology",
  "Pediatrics",
  "General Medicine",
];
const bloodGroupsList = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const statusColors = {
  Scheduled: "bg-blue-100 text-blue-600 border-blue-200 px-2",
  Waiting: "bg-amber-100 text-amber-600 border-amber-300 px-5",
  "In Progress": "bg-green-100 text-green-700 border-green-200",
  Completed: "bg-gray-100 text-gray-600 border-gray-200",
  "Follow-up": "bg-purple-100 text-purple-700 border-purple-200",
};

// Helper functions for error messages
const getErrorMessage = (error) => {
  if (!error.response) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  const msg = error.response.data?.message || "";
  const status = error.response.status;

  const mappings = [
    {
      keywords: ["doctor", "Doctor reference is required"],
      message: "Please select a doctor.",
    },
    {
      keywords: ["patient", "Patient reference is required"],
      message: "Please select a patient.",
    },
    {
      keywords: ["Appointment validation failed", "appointment validation"],
      message: "Please complete all appointment details.",
    },
    {
      keywords: ["ValidationError", "Validation", "validation failed"],
      message: "Please check the information you entered.",
    },
    {
      keywords: ["duplicate", "already exists", "E11000"],
      message: "A record with these details already exists.",
    },
    { keywords: ["PAN", "pan"], message: "Please enter a valid PAN number." },
    {
      keywords: ["Email", "email"],
      message: "Please enter a valid email address.",
    },
    {
      keywords: ["mobile", "phone", "Mobile"],
      message: "Please enter a valid 10-digit mobile number.",
    },
    {
      keywords: ["No patients found", "No patient found"],
      message: "No patients are available.",
    },
    {
      keywords: ["No Appoinments found", "No appointments found"],
      message: "No appointments are scheduled.",
    },
    {
      keywords: ["Access Denied", "authorization", "unauthorized"],
      message: "You do not have permission to perform this action.",
    },
    {
      keywords: ["token", "invalid token"],
      message: "Your session has expired. Please login again.",
    },
    {
      keywords: ["time slot", "already booked"],
      message: "This time slot is already booked. Please select another time.",
    },
    {
      keywords: ["discharge", "pending dues"],
      message: "Please clear all pending dues first.",
    },
  ];

  for (const item of mappings) {
    if (
      item.keywords.some((k) => msg.toLowerCase().includes(k.toLowerCase()))
    ) {
      return item.message;
    }
  }

  if (status === 500)
    return "An unexpected server error occurred. Please try again later.";
  if (status === 404) return "The requested information was not found.";
  if (status === 400) return "Please check the information you entered.";
  if (status === 401) return "Please login again to continue.";
  if (status === 403)
    return "You do not have permission to perform this action.";
  if (status === 422) return "Please check your input and try again.";

  return msg || "Something went wrong. Please try again.";
};

// Helper functions for patient data
function getPatientName(appointment) {
  if (appointment.name) return appointment.name;
  if (appointment.patient?.name) return appointment.patient.name;
  if (appointment.patientId?.name) return appointment.patientId.name;
  return "Unknown";
}

function getPatientPid(appointment) {
  if (appointment.pid) return appointment.pid;
  if (appointment.patient?.pid) return appointment.patient.pid;
  if (appointment.patientId?.pid) return appointment.patientId.pid;
  return "N/A";
}

// Helper functions for doctor data
function getDoctorName(appointment, doctorsList) {
  if (appointment.doctor?.fullname) {
    return appointment.doctor.fullname;
  }
  if (appointment.doctorId) {
    const doc = doctorsList?.find((d) => d._id === appointment.doctorId);
    if (doc) return doc.fullname;
  }
  if (appointment.assignedDoctorId) {
    const doc = doctorsList?.find(
      (d) => d._id === appointment.assignedDoctorId,
    );
    if (doc) return doc.fullname;
  }
  if (appointment.assignedDoctorName) {
    const doc = doctorsList?.find(
      (d) =>
        d._id === appointment.assignedDoctorName ||
        d.fullname === appointment.assignedDoctorName,
    );
    return doc?.fullname || appointment.assignedDoctorName;
  }
  return "N/A";
}

function getSpecialization(appointment, doctorsList) {
  if (appointment.doctor?.specialisation) {
    return appointment.doctor.specialisation;
  }
  if (appointment.specialization) {
    return appointment.specialization;
  }
  if (appointment.doctorId) {
    const doc = doctorsList?.find((d) => d._id === appointment.doctorId);
    if (doc) return doc.specialisation;
  }
  if (appointment.assignedDoctorId) {
    const doc = doctorsList?.find(
      (d) => d._id === appointment.assignedDoctorId,
    );
    if (doc) return doc.specialisation;
  }
  return "N/A";
}

// Discharge helper functions
function getDischargePatientName(discharge) {
  if (discharge.patient?.name) return discharge.patient.name;
  if (discharge.name) return discharge.name;
  return "Unknown";
}

function getDischargePatientPid(discharge) {
  if (discharge.patient?.pid) return discharge.patient.pid;
  if (discharge.patientPid) return discharge.patientPid;
  return "N/A";
}

function getDischargeRoom(discharge) {
  if (discharge.room?.roomNumber) return `Room ${discharge.room.roomNumber}`;
  if (discharge.roomNumber) return `Room ${discharge.roomNumber}`;
  return "—";
}

function getDischargePending(discharge) {
  if (discharge.pendingAmount !== undefined) return discharge.pendingAmount;
  const total = discharge.totalBill || 0;
  const paid = discharge.paidAmount || 0;
  return Math.max(0, total - paid);
}

export default function ManagerDashboard({ role }) {
  const [search, setSearch] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today); // Default to today
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [tab, setTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [ipDischarges, setIpDischarges] = useState([]);
  const [existingPatients, setExistingPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isNewAppointmentWizard, setIsNewAppointmentWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [patientMode, setPatientMode] = useState("new");
  const [existingPatientSearch, setExistingPatientSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [timeQuery, setTimeQuery] = useState("");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [dischargeModal, setDischargeModal] = useState(null);

  const [newAppointmentData, setNewAppointmentData] = useState({
    id: null,
    pid: "",
    name: "",
    dob: "",
    mobilePhone: "",
    email: "",
    gender: "Male",
    bloodGroup: "O+",
    address: "",
    specialization: specializationsList[0],
    assignedDoctorId: "", // Changed from assignedDoctorName
    appointmentDate: todayDate,
    appointmentTime: "",
    paymentMethod: "Cash",
    upiId: "",
    tokenNumber: null,
    paymentTimestamp: null,
    consultationFee: 500,
    from: "OPD",
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
    fetchDischarges();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appoinmentapi");
      setAppointments(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/patientapi");
      setExistingPatients(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/userapi");
      const docs = (res.data.data || res.data).filter(
        (u) =>
          u.role === "seniordoctor" ||
          u.role === "juniordoctor" ||
          u.role === "doctor",
      );
      setDoctors(docs);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchDischarges = async () => {
    try {
      setLoading(true);
      const res = await api.get("/roomsapi/discharge");
      setIpDischarges(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching discharges:", err);
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments - shows today's appointments by default
  const filtered = appointments.filter((a) => {
    const appointmentDate = a.appointmentDate?.split("T")[0];

    const matchesSearch =
      getPatientName(a).toLowerCase().includes(search.toLowerCase()) ||
      getPatientPid(a).toLowerCase().includes(search.toLowerCase()) ||
      getDoctorName(a, doctors).toLowerCase().includes(search.toLowerCase());

    const matchesDate = appointmentDate === selectedDate;

    const matchesDoctor =
      !selectedDoctor || getDoctorName(a, doctors) === selectedDoctor;

    return matchesSearch && matchesDate && matchesDoctor;
  });

  const selectedDoctorInfo = doctors.find(
    (d) => d._id === newAppointmentData.assignedDoctorId,
  );

  const availableDoctors = doctors.filter(
    (d) => d.specialisation === newAppointmentData.specialization, // British spelling
  );

  const getAvailableTimeSlots = () => {
    if (!selectedDoctorInfo) return [];

    const start =
      selectedDoctorInfo.workingHours?.start ||
      selectedDoctorInfo.start ||
      "09:00";
    const end =
      selectedDoctorInfo.workingHours?.end || selectedDoctorInfo.end || "17:00";

    let slots = [];
    let [h, m] = start.split(":").map(Number);
    let [endH, endM] = end.split(":").map(Number);

    while (h < endH || (h === endH && m <= endM)) {
      let hh = h.toString().padStart(2, "0");
      let mm = m.toString().padStart(2, "0");
      let ampm = h >= 12 ? "PM" : "AM";
      let h12 = h % 12 || 12;
      let hh12 = h12.toString().padStart(2, "0");
      slots.push({
        val24: `${hh}:${mm}`,
        val12: `${hh12}:${mm} ${ampm}`,
      });
      m += 15;
      if (m >= 60) {
        m = 0;
        h += 1;
      }
    }

    const doctorId = newAppointmentData.assignedDoctorId;

    const bookedSlots = appointments
      .filter((a) => {
        const appointmentDate = a.appointmentDate?.split("T")[0];
        const matchesDate =
          appointmentDate === newAppointmentData.appointmentDate;
        const matchesDoctor =
          a.doctorId === doctorId ||
          a.assignedDoctorId === doctorId ||
          a.assignedDoctorName === doctorId ||
          a.doctor?._id === doctorId;
        return matchesDate && matchesDoctor;
      })
      .map((a) => a.appointmentTime);

    return slots.filter((s) => !bookedSlots.includes(s.val12));
  };

  const availableSlots = getAvailableTimeSlots();

  const handleAutoPickTime = () => {
    if (availableSlots.length > 0) {
      setTimeQuery(availableSlots[0].val24);
      setNewAppointmentData({
        ...newAppointmentData,
        appointmentTime: availableSlots[0].val12,
      });
      setShowTimeDropdown(false);
      setErrorMsg("");
    } else {
      setErrorMsg("No available slots for this doctor on the selected date.");
    }
  };

  const openNewAppointmentModal = () => {
    const initialDocs = doctors.filter(
      (d) => d.specialisation === specializationsList[0],
    );
    setNewAppointmentData({
      id: Date.now(),
      pid: "",
      name: "",
      dob: "",
      mobilePhone: "",
      email: "",
      gender: "Male",
      bloodGroup: "O+",
      address: "",
      specialization: specializationsList[0],
      assignedDoctorId: initialDocs.length > 0 ? initialDocs[0]._id : "",
      appointmentDate: todayDate,
      appointmentTime: "",
      paymentMethod: "Cash",
      upiId: "",
      tokenNumber: null,
      paymentTimestamp: null,
      consultationFee: 500,
      from: "OPD",
    });
    setTimeQuery("");
    setPatientMode("new");
    setWizardStep(1);
    setIsNewAppointmentWizard(true);
    setShowModal(true);
    setErrorMsg("");
  };

  const handleNext = () => {
    setErrorMsg("");
    if (wizardStep === 1) {
      if (patientMode === "new") {
        const { name, mobilePhone, dob, email, address, bloodGroup, gender } =
          newAppointmentData;
        const today = new Date().toISOString().split("T")[0];
        if (dob > today) {
          setErrorMsg("Date of Birth cannot be in the future.");
          return;
        }
        if (
          !name ||
          !mobilePhone ||
          !dob ||
          !email ||
          !address ||
          !bloodGroup ||
          !gender
        ) {
          setErrorMsg("All fields are required for new registration.");
          return;
        }
        if (!/^[6-9]\d{9}$/.test(mobilePhone)) {
          setErrorMsg("Enter a valid 10-digit mobile number.");
          return;
        }
      } else {
        if (!newAppointmentData.pid) {
          setErrorMsg("Please select an existing patient.");
          return;
        }
      }
      setWizardStep(2);
    } else if (wizardStep === 2) {
      if (
        !newAppointmentData.specialization ||
        !newAppointmentData.appointmentDate ||
        !newAppointmentData.appointmentTime
      ) {
        setErrorMsg(
          "Please fill all scheduling details and select a valid time slot.",
        );
        return;
      }
      setWizardStep(3);
    } else if (wizardStep === 3) {
      if (
        newAppointmentData.paymentMethod === "UPI" &&
        !newAppointmentData.upiId
      ) {
        setErrorMsg("UPI Transaction ID is required.");
        return;
      }
      saveNewAppointment();
    }
  };

  const saveNewAppointment = async () => {
    try {
      setLoading(true);
      const paymentTimestamp = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      let patientId = newAppointmentData.pid;

      if (patientMode === "new") {
        const patientData = {
          name: newAppointmentData.name,
          mobilePhone: newAppointmentData.mobilePhone, // Fixed: was using phone
          email: newAppointmentData.email,
          dob: newAppointmentData.dob,
          gender: newAppointmentData.gender,
          bloodGroup: newAppointmentData.bloodGroup,
          address: newAppointmentData.address,
        };

        const patientRes = await api.post("/patientapi", patientData);
        patientId = patientRes.data.data?._id || patientRes.data._id;

        setNewAppointmentData((prev) => ({
          ...prev,
          pid: patientId,
          paymentTimestamp,
        }));
      }

      // Use correct field names that match backend expectations
      const appointmentData = {
        patient: patientId, // Changed from patientId
        doctor: newAppointmentData.assignedDoctorId, // Changed from doctorId
        specialization: newAppointmentData.specialization,
        appointmentDate: newAppointmentData.appointmentDate,
        appointmentTime: newAppointmentData.appointmentTime,
        paymentMethod: newAppointmentData.paymentMethod,
        upiId: newAppointmentData.upiId || undefined,
        consultationFee: newAppointmentData.consultationFee,
        from: newAppointmentData.from || "OPD",
      };

      const appointmentRes = await api.post("/appoinmentapi", appointmentData);
      const newAppointment = appointmentRes.data.data || appointmentRes.data;

      setNewAppointmentData((prev) => ({
        ...prev,
        tokenNumber: newAppointment.tokenNumber,
        pid: newAppointment.patient?.pid || patientId,
      }));

      setWizardStep(4);
      fetchAppointments();
    } catch (err) {
      console.error("Error saving appointment:", err);
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDischargeConfirm = async () => {
    try {
      setLoading(true);
      if (dischargeModal.method === "UPI" && !dischargeModal.upiId) {
        setErrorMsg("UPI Transaction ID is required.");
        return;
      }

      const userId = localStorage.getItem("userId");

      await api.put(`/patientapi/discharge/${userId}`, {
        patientId:
          dischargeModal.req.patient?._id ||
          dischargeModal.req.patientId ||
          dischargeModal.req.patient,
        paymentMethod: dischargeModal.method,
        upiId: dischargeModal.upiId || undefined,
      });

      fetchDischarges();
      setDischargeModal({ ...dischargeModal, step: "success" });
      setErrorMsg("");
    } catch (err) {
      console.error("Error processing discharge:", err);
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 0; }
          body { padding: 2cm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="print:hidden">
        <Layout>
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString("en-GB", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={openNewAppointmentModal}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <span className="loading-spinner"></span>}
                <Plus className="w-4 h-4" /> New Appointment
              </button>
            </div>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setTab("appointments")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "appointments" ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
              >
                Appointments ({appointments.length})
              </button>
              <button
                onClick={() => setTab("ip-discharge")}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${tab === "ip-discharge" ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
              >
                IP Discharge
                {ipDischarges.filter((d) => d.status === "Pending").length >
                  0 && (
                  <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {ipDischarges.filter((d) => d.status === "Pending").length}
                  </span>
                )}
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {errorMsg}
                <button
                  onClick={() => setErrorMsg("")}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {tab === "appointments" && (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-[250px] bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <Search className="w-6 h-4" />
                    <input
                      placeholder="Search by name, PID, doctor..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm text-gray-700"
                    />
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  >
                    <option value="">All Doctors</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor.fullname}>
                        {doctor.fullname}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        {[
                          "Token",
                          "PID",
                          "Patient Name",
                          "Doctor",
                          "Specialization",
                          "From",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center py-8 text-gray-500"
                          >
                            <div className="flex items-center justify-center gap-2">
                              <span className="loading-spinner"></span>
                              Loading appointments...
                            </div>
                          </td>
                        </tr>
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center py-8 text-gray-500"
                          >
                            No appointments found for this date
                          </td>
                        </tr>
                      ) : (
                        filtered.map((a) => (
                          <tr
                            key={a._id || a.id}
                            className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors"
                          >
                            <td className="px-5 py-4">
                              <div className="text-gray-900 font-medium">
                                #{a.tokenNumber}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-gray-500 font-medium">
                              {getPatientPid(a)}
                            </td>
                            <td className="px-5 py-4 text-gray-900 font-medium">
                              {getPatientName(a)}
                            </td>
                            <td className="px-5 py-4 text-gray-600">
                              {getDoctorName(a, doctors)}
                            </td>
                            <td className="px-5 py-4 text-gray-500">
                              {getSpecialization(a, doctors)}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                  a.from === "IP" || a.from === "ip"
                                    ? "bg-purple-100 text-purple-700 border-purple-200"
                                    : "bg-blue-100 text-blue-700 border-blue-200"
                                }`}
                              >
                                {a.from || "OPD"}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[a.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                              >
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "ip-discharge" && (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">
                    Patients Discharge Queue
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        {[
                          "Patient",
                          "PID",
                          "Room",
                          "Total Bill",
                          "Paid",
                          "Pending",
                          "Status",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-8 text-gray-500"
                          >
                            <div className="flex items-center justify-center gap-2">
                              <span className="loading-spinner"></span>
                              Loading discharges...
                            </div>
                          </td>
                        </tr>
                      ) : ipDischarges.length === 0 ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-8 text-gray-500"
                          >
                            No discharge records found
                          </td>
                        </tr>
                      ) : (
                        ipDischarges.map((adm) => {
                          const pending = getDischargePending(adm);
                          const total = adm.totalBill || 0;
                          const paid = adm.paidAmount || 0;
                          return (
                            <tr
                              key={adm._id || adm.id}
                              className={`border-b border-gray-50 transition-colors ${adm.status === "Cleared" ? "bg-green-50/30" : "hover:bg-blue-50/50"}`}
                            >
                              <td className="px-5 py-4 text-gray-900 font-medium">
                                {getDischargePatientName(adm)}
                              </td>
                              <td className="px-5 py-4 text-gray-500 font-medium">
                                {getDischargePatientPid(adm)}
                              </td>
                              <td className="px-5 py-4 text-gray-500">
                                {getDischargeRoom(adm)}
                              </td>
                              <td className="px-5 py-4 text-gray-900">
                                Rs. {total}
                              </td>
                              <td className="px-5 py-4 text-green-600">
                                Rs. {paid}
                              </td>
                              <td className="px-5 py-4 text-red-600 font-medium">
                                Rs. {pending}
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium border ${adm.status === "Cleared" ? "bg-green-100 text-green-700 border-green-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}
                                >
                                  {adm.status}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                {adm.status === "Pending" ? (
                                  <button
                                    onClick={() => {
                                      setDischargeModal({
                                        req: adm,
                                        step: "payment",
                                        method: "Cash",
                                        upiId: "",
                                      });
                                      setErrorMsg("");
                                    }}
                                    className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-3 py-1.5 font-medium hover:bg-blue-100 transition-colors"
                                    disabled={loading}
                                  >
                                    View & Discharge
                                  </button>
                                ) : (
                                  <span className="text-xs text-gray-400 italic">
                                    Discharged
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MODAL: NEW APPOINTMENT */}
            {showModal && isNewAppointmentWizard && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
                  <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                      New Appointment —{" "}
                      {wizardStep === 1
                        ? "Patient Details"
                        : wizardStep === 2
                          ? "Doctor Scheduling"
                          : wizardStep === 3
                            ? "Payment"
                            : "Confirmed"}
                    </h2>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setIsNewAppointmentWizard(false);
                      }}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 overflow-y-auto">
                    {wizardStep < 4 && (
                      <div className="flex items-center gap-4 mb-6 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${wizardStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}
                          >
                            {wizardStep > 1 ? (
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            ) : (
                              1
                            )}
                          </div>
                          <span
                            className={
                              wizardStep >= 1
                                ? "text-gray-900 font-semibold hidden sm:block"
                                : "text-gray-400 hidden sm:block"
                            }
                          >
                            Details
                          </span>
                        </div>
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${wizardStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}
                          >
                            {wizardStep > 2 ? (
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            ) : (
                              2
                            )}
                          </div>
                          <span
                            className={
                              wizardStep >= 2
                                ? "text-gray-900 font-semibold hidden sm:block"
                                : "text-gray-400 hidden sm:block"
                            }
                          >
                            Schedule
                          </span>
                        </div>
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${wizardStep === 3 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}
                          >
                            3
                          </div>
                          <span
                            className={
                              wizardStep === 3
                                ? "text-gray-900 font-semibold hidden sm:block"
                                : "text-gray-400 hidden sm:block"
                            }
                          >
                            Payment
                          </span>
                        </div>
                      </div>
                    )}

                    {wizardStep === 1 && (
                      <div>
                        <div className="flex mb-5 bg-gray-50 p-1 rounded-lg w-fit border border-gray-200">
                          <button
                            type="button"
                            onClick={() => {
                              setPatientMode("new");
                              setErrorMsg("");
                            }}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${patientMode === "new" ? "bg-white text-blue-700 shadow-sm border border-gray-200/50" : "text-gray-600 hover:text-gray-900"}`}
                          >
                            New Patient
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPatientMode("existing");
                              setErrorMsg("");
                            }}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${patientMode === "existing" ? "bg-white text-blue-700 shadow-sm border border-gray-200/50" : "text-gray-600 hover:text-gray-900"}`}
                          >
                            Existing Patient
                          </button>
                        </div>

                        {patientMode === "new" ? (
                          <div className="grid gap-4 md:grid-cols-2">
                            <label className="space-y-1 md:col-span-2">
                              <span className="text-sm font-medium text-gray-700">
                                Full Name
                              </span>
                              <input
                                value={newAppointmentData.name}
                                onChange={(e) =>
                                  setNewAppointmentData({
                                    ...newAppointmentData,
                                    name: e.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              />
                            </label>
                            <label className="space-y-1">
                              <span className="text-sm font-medium text-gray-700">
                                Date of Birth
                              </span>
                              <input
                                type="date"
                                max={todayDate}
                                value={newAppointmentData.dob}
                                onChange={(e) =>
                                  setNewAppointmentData({
                                    ...newAppointmentData,
                                    dob: e.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              />
                            </label>
                            <label className="space-y-1">
                              <span className="text-sm font-medium text-gray-700">
                                Mobile Phone (10 digits)
                              </span>
                              <input
                                type="tel"
                                maxLength={10}
                                value={newAppointmentData.mobilePhone}
                                onChange={(e) =>
                                  setNewAppointmentData({
                                    ...newAppointmentData,
                                    mobilePhone: e.target.value.replace(
                                      /\D/g,
                                      "",
                                    ),
                                  })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              />
                            </label>
                            <label className="space-y-1">
                              <span className="text-sm font-medium text-gray-700">
                                Email
                              </span>
                              <input
                                type="email"
                                value={newAppointmentData.email}
                                onChange={(e) =>
                                  setNewAppointmentData({
                                    ...newAppointmentData,
                                    email: e.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              />
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                              <label className="space-y-1">
                                <span className="text-sm font-medium text-gray-700">
                                  Gender
                                </span>
                                <select
                                  value={newAppointmentData.gender}
                                  onChange={(e) =>
                                    setNewAppointmentData({
                                      ...newAppointmentData,
                                      gender: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                  <option>Male</option>
                                  <option>Female</option>
                                  <option>Other</option>
                                </select>
                              </label>
                              <label className="space-y-1">
                                <span className="text-sm font-medium text-gray-700">
                                  Blood Group
                                </span>
                                <select
                                  value={newAppointmentData.bloodGroup}
                                  onChange={(e) =>
                                    setNewAppointmentData({
                                      ...newAppointmentData,
                                      bloodGroup: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="">Select...</option>
                                  {bloodGroupsList.map((bg) => (
                                    <option key={bg} value={bg}>
                                      {bg}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>
                            <label className="space-y-1 md:col-span-2">
                              <span className="text-sm font-medium text-gray-700">
                                Postal Address
                              </span>
                              <textarea
                                rows={2}
                                value={newAppointmentData.address}
                                onChange={(e) =>
                                  setNewAppointmentData({
                                    ...newAppointmentData,
                                    address: e.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="relative">
                              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                value={existingPatientSearch}
                                onChange={(e) =>
                                  setExistingPatientSearch(e.target.value)
                                }
                                placeholder="Search patients by PID or Name..."
                                className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm h-64 overflow-y-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                  <tr>
                                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600">
                                      PID
                                    </th>
                                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600">
                                      Name
                                    </th>
                                    <th className="px-4 py-2.5 text-left font-semibold text-gray-600">
                                      Phone
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {existingPatients
                                    .filter(
                                      (p) =>
                                        (p.pid || "")
                                          .toLowerCase()
                                          .includes(
                                            existingPatientSearch.toLowerCase(),
                                          ) ||
                                        (p.name || "")
                                          .toLowerCase()
                                          .includes(
                                            existingPatientSearch.toLowerCase(),
                                          ),
                                    )
                                    .map((patient) => (
                                      <tr
                                        key={patient._id || patient.pid}
                                        onClick={() => {
                                          setNewAppointmentData({
                                            ...newAppointmentData,
                                            pid: patient._id || patient.pid,
                                            name: patient.name,
                                            mobilePhone: patient.mobilePhone,
                                          });
                                          setErrorMsg("");
                                        }}
                                        className={`cursor-pointer ${newAppointmentData.pid === (patient._id || patient.pid) ? "bg-blue-50" : "hover:bg-gray-50"}`}
                                      >
                                        <td className="px-4 py-3 font-medium text-gray-600">
                                          {patient.pid}
                                        </td>
                                        <td className="px-4 py-3 text-gray-900">
                                          {patient.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                          {patient.mobilePhone}
                                        </td>
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
                      <div className="space-y-5">
                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm flex gap-4 shadow-sm">
                          <div>
                            <span className="text-gray-500 text-xs block">
                              Patient
                            </span>
                            <span className="font-semibold text-gray-900">
                              {newAppointmentData.name || "Unknown"}
                            </span>
                          </div>
                          <div className="w-px h-8 bg-blue-200"></div>
                          <div>
                            <span className="text-gray-500 text-xs block">
                              PID
                            </span>
                            <span className="font-semibold text-gray-900">
                              {newAppointmentData.pid}
                            </span>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="space-y-1">
                            <span className="text-sm font-medium text-gray-700">
                              Specialization
                            </span>
                            <select
                              value={newAppointmentData.specialization}
                              onChange={(e) => {
                                const newSpec = e.target.value;
                                const docs = doctors.filter(
                                  (d) => d.specialisation === newSpec,
                                );
                                setNewAppointmentData({
                                  ...newAppointmentData,
                                  specialization: newSpec,
                                  assignedDoctorId: docs[0]?._id || "",
                                  appointmentTime: "",
                                });
                                setTimeQuery("");
                              }}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                              {specializationsList.map((spec) => (
                                <option key={spec} value={spec}>
                                  {spec}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-medium text-gray-700">
                              Doctor
                            </span>
                            <select
                              value={newAppointmentData.assignedDoctorId}
                              onChange={(e) => {
                                setNewAppointmentData({
                                  ...newAppointmentData,
                                  assignedDoctorId: e.target.value,
                                  appointmentTime: "",
                                });
                                setTimeQuery("");
                              }}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              disabled={!newAppointmentData.specialization}
                            >
                              {availableDoctors.map((doc) => (
                                <option key={doc._id} value={doc._id}>
                                  {doc.fullname}
                                </option>
                              ))}
                            </select>
                            {selectedDoctorInfo && (
                              <p className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1.5">
                                <Clock className="w-3 h-3" />
                                Working Hours:{" "}
                                {selectedDoctorInfo.workingHours?.start ||
                                  selectedDoctorInfo.start ||
                                  "09:00"}{" "}
                                -{" "}
                                {selectedDoctorInfo.workingHours?.end ||
                                  selectedDoctorInfo.end ||
                                  "17:00"}
                              </p>
                            )}
                          </label>
                          <label className="space-y-1 sm:col-span-2">
                            <span className="text-sm font-medium text-gray-700">
                              Appointment Date
                            </span>
                            <input
                              type="date"
                              min={todayDate}
                              value={newAppointmentData.appointmentDate}
                              onChange={(e) => {
                                setNewAppointmentData({
                                  ...newAppointmentData,
                                  appointmentDate: e.target.value,
                                  appointmentTime: "",
                                });
                                setTimeQuery("");
                              }}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </label>
                        </div>

                        <div className="space-y-2 relative">
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Time Slot
                            </span>
                            <button
                              onClick={handleAutoPickTime}
                              type="button"
                              className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200 transition-colors"
                            >
                              Auto Pick Slot
                            </button>
                          </div>

                          <input
                            type="text"
                            value={timeQuery}
                            onFocus={() => setShowTimeDropdown(true)}
                            onBlur={() =>
                              setTimeout(() => setShowTimeDropdown(false), 200)
                            }
                            onChange={(e) => {
                              setTimeQuery(e.target.value);
                              setNewAppointmentData({
                                ...newAppointmentData,
                                appointmentTime: "",
                              });
                              setShowTimeDropdown(true);
                            }}
                            placeholder="Type time in 24h format (e.g. 14 for 2 PM)"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />

                          {showTimeDropdown && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1 divide-y divide-gray-100">
                              {availableSlots.length > 0 ? (
                                availableSlots.filter((s) =>
                                  s.val24
                                    .replace(/^0/, "")
                                    .startsWith(timeQuery.replace(/^0/, "")),
                                ).length > 0 ? (
                                  availableSlots
                                    .filter((s) =>
                                      s.val24
                                        .replace(/^0/, "")
                                        .startsWith(
                                          timeQuery.replace(/^0/, ""),
                                        ),
                                    )
                                    .map((slot) => (
                                      <li
                                        key={slot.val24}
                                        onClick={() => {
                                          setTimeQuery(slot.val24);
                                          setNewAppointmentData({
                                            ...newAppointmentData,
                                            appointmentTime: slot.val12,
                                          });
                                          setShowTimeDropdown(false);
                                        }}
                                        className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                                      >
                                        <span className="font-semibold text-gray-700">
                                          {slot.val24}
                                        </span>
                                        <span className="text-gray-500">
                                          {slot.val12}
                                        </span>
                                      </li>
                                    ))
                                ) : (
                                  <li className="px-4 py-3 text-sm text-gray-500 text-center">
                                    No slots match your search.
                                  </li>
                                )
                              ) : (
                                <li className="px-4 py-3 text-sm text-red-500 text-center font-medium">
                                  Doctor is fully booked on this date.
                                </li>
                              )}
                            </ul>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Booked slots are automatically hidden from the list.
                          </p>
                        </div>
                      </div>
                    )}

                    {wizardStep === 3 && (
                      <div className="space-y-5">
                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm flex flex-wrap gap-4 shadow-sm">
                          <div>
                            <span className="text-gray-500 text-xs block">
                              Patient
                            </span>
                            <span className="font-semibold text-gray-900">
                              {newAppointmentData.name}
                            </span>
                          </div>
                          <div className="w-px h-8 bg-blue-200"></div>
                          <div>
                            <span className="text-gray-500 text-xs block">
                              Doctor
                            </span>
                            <span className="font-semibold text-gray-900">
                              {selectedDoctorInfo?.fullname || "N/A"}
                            </span>
                          </div>
                          <div className="w-px h-8 bg-blue-200"></div>
                          <div>
                            <span className="text-gray-500 text-xs block">
                              Time
                            </span>
                            <span className="font-semibold text-gray-900">
                              {newAppointmentData.appointmentDate} at{" "}
                              {newAppointmentData.appointmentTime}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Fee Breakdown
                          </div>
                          <div className="p-4 space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Consultation Fee</span>
                              <span className="font-medium text-gray-900">
                                Rs. {newAppointmentData.consultationFee}
                              </span>
                            </div>
                            <div className="flex justify-between text-base font-semibold text-blue-700 bg-blue-50 p-3 rounded-lg -mx-2">
                              <span>Amount to Collect</span>
                              <span>
                                Rs. {newAppointmentData.consultationFee}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="text-sm font-medium text-gray-700">
                            Payment Method
                          </div>
                          <div className="grid gap-3 grid-cols-3">
                            {["Cash", "UPI", "Card"].map((method) => (
                              <button
                                key={method}
                                type="button"
                                onClick={() => {
                                  setNewAppointmentData({
                                    ...newAppointmentData,
                                    paymentMethod: method,
                                    upiId: "",
                                  });
                                  setErrorMsg("");
                                }}
                                className={`rounded-lg border px-3 py-3 text-sm font-semibold transition-all ${newAppointmentData.paymentMethod === method ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                          {newAppointmentData.paymentMethod === "UPI" && (
                            <div className="mt-3 animate-in fade-in">
                              <label className="space-y-1 block">
                                <span className="text-sm font-medium text-gray-700">
                                  UPI Transaction ID{" "}
                                  <span className="text-red-500">*</span>
                                </span>
                                <input
                                  value={newAppointmentData.upiId}
                                  onChange={(e) =>
                                    setNewAppointmentData({
                                      ...newAppointmentData,
                                      upiId: e.target.value,
                                    })
                                  }
                                  placeholder="Enter 12-digit Ref ID"
                                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {wizardStep === 4 && (
                      <div className="py-2">
                        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden shadow mb-4">
                          <div className="bg-green-50 border-b border-green-100 px-5 py-4 flex items-center justify-between">
                            <div>
                              <p className="text-xs text-green-700 font-bold uppercase">
                                Payment Successful
                              </p>
                              <h3 className="text-lg font-bold text-gray-900">
                                Appointment Confirmed
                              </h3>
                            </div>
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                              <Check
                                className="w-5 h-5 text-white"
                                strokeWidth={3}
                              />
                            </div>
                          </div>
                          <div className="p-5 space-y-2.5 text-sm">
                            <div className="flex justify-between pb-2 border-b border-gray-100">
                              <span className="text-gray-500">Token No</span>
                              <span className="font-bold text-gray-900 text-base">
                                #{newAppointmentData.tokenNumber}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Patient</span>
                              <span className="font-medium text-gray-900">
                                {newAppointmentData.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Patient ID</span>
                              <span className="text-gray-900 font-medium">
                                {newAppointmentData.pid}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Doctor</span>
                              <span className="text-gray-900 font-medium">
                                {selectedDoctorInfo?.fullname || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">
                                Scheduled Time
                              </span>
                              <span className="text-gray-900 font-medium">
                                {newAppointmentData.appointmentDate} |{" "}
                                {newAppointmentData.appointmentTime}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">
                                Payment Date
                              </span>
                              <span className="text-gray-900 font-medium">
                                {newAppointmentData.paymentTimestamp}
                              </span>
                            </div>

                            <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between text-base font-bold text-green-700 bg-green-50 p-2 rounded-lg -mx-2">
                              <span>
                                Paid via {newAppointmentData.paymentMethod}
                              </span>
                              <span>₹{newAppointmentData.consultationFee}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 justify-center max-w-md mx-auto">
                          <button
                            onClick={() => window.print()}
                            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50"
                          >
                            <Printer className="w-4 h-4" /> Print Bill
                          </button>
                          <button
                            onClick={() => {
                              setShowModal(false);
                              setIsNewAppointmentWizard(false);
                            }}
                            className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}

                    {wizardStep < 4 && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        {errorMsg && (
                          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-100 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            {errorMsg}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              if (wizardStep === 1) {
                                setShowModal(false);
                                setIsNewAppointmentWizard(false);
                              } else {
                                setWizardStep((prev) => prev - 1);
                                setErrorMsg("");
                              }
                            }}
                            className="px-5 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            {wizardStep === 1 ? "Cancel" : "Back"}
                          </button>
                          <button
                            type="button"
                            onClick={handleNext}
                            disabled={loading}
                            className={`px-6 py-2 text-sm font-semibold text-white rounded-lg flex items-center gap-2 shadow-sm ${wizardStep === 3 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {loading && (
                              <span className="loading-spinner"></span>
                            )}
                            {wizardStep === 3 && <Check className="w-4 h-4" />}
                            {wizardStep === 3 ? "Confirm Payment" : "Next"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MODAL: DISCHARGE PAYMENT */}
            {dischargeModal && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">
                      Discharge Clearance
                    </h2>
                    <button
                      onClick={() => {
                        setDischargeModal(null);
                        setErrorMsg("");
                      }}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-5">
                    {dischargeModal.step === "payment" ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Patient Name
                          </p>
                          <p className="font-semibold text-gray-900 mb-3">
                            {getDischargePatientName(dischargeModal.req)} (
                            {getDischargePatientPid(dischargeModal.req)})
                          </p>
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Total Bill</span>
                            <span>Rs. {dischargeModal.req.totalBill || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm text-green-600 mb-2">
                            <span>Amount Paid</span>
                            <span>
                              - Rs. {dischargeModal.req.paidAmount || 0}
                            </span>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-red-600 pt-2 border-t border-gray-200 mt-2">
                            <span>Pending Dues</span>
                            <span>
                              Rs. {getDischargePending(dischargeModal.req)}
                            </span>
                          </div>
                        </div>

                        {getDischargePending(dischargeModal.req) > 0 ? (
                          <>
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Payment Method
                              </p>
                              <div className="grid grid-cols-3 gap-2">
                                {["Cash", "UPI", "Card"].map((m) => (
                                  <button
                                    key={m}
                                    onClick={() => {
                                      setDischargeModal({
                                        ...dischargeModal,
                                        method: m,
                                        upiId: "",
                                      });
                                      setErrorMsg("");
                                    }}
                                    className={`py-2 rounded-lg border text-sm font-semibold ${dischargeModal.method === m ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
                                  >
                                    {m}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {dischargeModal.method === "UPI" && (
                              <label className="block mt-2">
                                <span className="text-sm font-medium text-gray-700 mb-1 block">
                                  UPI Transaction ID{" "}
                                  <span className="text-red-500">*</span>
                                </span>
                                <input
                                  value={dischargeModal.upiId}
                                  onChange={(e) =>
                                    setDischargeModal({
                                      ...dischargeModal,
                                      upiId: e.target.value,
                                    })
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                                  placeholder="12-digit Ref ID"
                                />
                              </label>
                            )}

                            {errorMsg && (
                              <p className="text-sm text-red-600 mt-2 font-medium bg-red-50 p-2 rounded border border-red-100">
                                {errorMsg}
                              </p>
                            )}

                            <button
                              onClick={handleDischargeConfirm}
                              disabled={loading}
                              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                              {loading && (
                                <span className="loading-spinner"></span>
                              )}
                              Collect Rs.{" "}
                              {getDischargePending(dischargeModal.req)} & Clear
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={handleDischargeConfirm}
                            disabled={loading}
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            {loading && (
                              <span className="loading-spinner"></span>
                            )}
                            Mark as Discharged (No Dues)
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Check
                            className="w-7 h-7 text-green-600"
                            strokeWidth={3}
                          />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Dues Cleared
                        </h3>
                        <p className="text-sm text-gray-500 mb-5">
                          Patient has been marked for discharge.
                        </p>
                        <button
                          onClick={() => setDischargeModal(null)}
                          className="w-full bg-gray-100 text-gray-800 font-bold py-2.5 rounded-lg text-sm hover:bg-gray-200"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Layout>
      </div>

      {/* PRINT ONLY UI */}
      <div className="hidden print:block w-full text-black font-sans">
        <div className="max-w-2xl mx-auto border border-gray-200 p-8 rounded-lg">
          <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
            <h1 className="text-2xl font-bold uppercase tracking-widest text-gray-900">
              Clinic Management System
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Official Consultation Receipt
            </p>
          </div>

          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Token #{newAppointmentData.tokenNumber}
            </h2>
            <div className="text-right text-sm text-gray-500 font-medium">
              <p>Payment Date: {newAppointmentData.paymentTimestamp}</p>
            </div>
          </div>

          <div className="space-y-5 text-base border-t border-gray-200 pt-6">
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="font-semibold text-gray-500 uppercase tracking-wide text-sm">
                Patient ID
              </span>
              <span className="font-bold text-gray-900">
                {newAppointmentData.pid}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="font-semibold text-gray-500 uppercase tracking-wide text-sm">
                Patient Name
              </span>
              <span className="font-bold text-gray-900">
                {newAppointmentData.name}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="font-semibold text-gray-500 uppercase tracking-wide text-sm">
                Doctor
              </span>
              <span className="font-bold text-gray-900">
                {selectedDoctorInfo?.fullname || "N/A"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="font-semibold text-gray-500 uppercase tracking-wide text-sm">
                Scheduled Time
              </span>
              <span className="font-bold text-gray-900">
                {newAppointmentData.appointmentDate} at{" "}
                {newAppointmentData.appointmentTime}
              </span>
            </div>

            <div className="flex justify-between pt-6 mt-4">
              <span className="font-semibold text-gray-500 uppercase tracking-wide text-sm">
                Consultation Fee
              </span>
              <span className="font-medium text-gray-900">
                Rs. {newAppointmentData.consultationFee}
              </span>
            </div>
            <div className="flex justify-between font-bold text-xl pt-4 border-t-2 border-gray-800 mt-2">
              <span>Total Paid ({newAppointmentData.paymentMethod})</span>
              <span>Rs. {newAppointmentData.consultationFee}</span>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 border-2 border-green-600 bg-green-50 text-green-700 px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm">
              <Check className="w-4 h-4" strokeWidth={3} /> Payment Received
            </div>
            <p className="text-gray-400 mt-6 text-sm font-medium">
              Thank you for visiting our clinic.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}