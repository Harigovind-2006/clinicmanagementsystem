import React from "react";

export default function PatientDetails() {
  const patient = {
    pid: "P001",
    name: "John Doe",
    dob: "1985-04-12",
    gender: "Male",
    bloodGroup: "O+",
    phone: "9001234567",
    email: "john@email.com",
    address: "10 Elm St, Delhi",
    registered: "2025-10-01",
  };

  const status = {
    type: "OP",
    lastBill: "2026-05-20",
    admitted: "2026-06-01",
    paymentUpto : "2026-06-10"
  };

  const DoctorNotes = {
    doctor: "Dr. Amit Sharma",
    DoctorNotes: "Patient recovering well. Continue current medication.",
    bp: "Blood Pressure: 130/85",
  };
    const bill = {
    

    };

  return (
    <div className="p-6 ml-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-blue-600 font-medium cursor-pointer">
            Patients
          </span>
          <span className="text-gray-400">{">"}</span>
          <span className="text-gray-700">{patient.name}</span>
        </div>

        <button className="border border-gray-300 rounded-xl px-5 py-2 font-medium hover:bg-gray-50">
          Edit Details
        </button>
      </div>
      <div className="flex mb-6">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-l-xl font-medium">
          Current Visit
        </button>

        <button className="border border-gray-300 px-6 py-2 rounded-r-xl text-gray-700">
          History (1)
        </button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        
        <div className="col-span-2 bg-white border border-gray-300 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-8">
            Personal Information
          </h2>

          <div className="grid grid-cols-2 gap-y-8 gap-x-12">
            <div>
              <p className="text-gray-500 text-sm">PID</p>
              <p className="font-medium">{patient.pid}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p className="font-medium">{patient.name}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Date of Birth</p>
              <p className="font-medium">{patient.dob}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Gender</p>
              <p className="font-medium">{patient.gender}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Blood Group</p>
              <p className="font-medium">{patient.bloodGroup}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-medium">{patient.phone}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{patient.email}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Address</p>
              <p className="font-medium">{patient.address}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Registered</p>
              <p className="font-medium">{patient.registered}</p>
            </div>
          </div>
        </div>

       
        <div className="space-y-6">
       
          <div className="bg-white border border-gray-300 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Current Status
            </h2>

            <div className="flex justify-between mb-4">
                 <span className="text-gray-500"> Type</span>
                <span
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      status.type === "OP"
                        ? "bg-blue-100 text-blue-700"
                         : "bg-green-100 text-green-700"
                    }`}
                 >
                  {status.type}
                 </span>
            </div>
             <div className="flex justify-between mb-4">
              <span className="text-gray-500"> Admitted</span>
              <span>{status.admitted}</span>
            </div>
            <div className="flex justify-between  mb-4">
              <span className="text-gray-500"> Payment Up To</span>
              <span>{status.paymentUpto}</span>
            </div>

            <div className="flex justify-between  mb-4">
              <span className="text-gray-500">Last Bill</span>
              <span>{status.lastBill}</span>
            </div>
          </div>

         
          <div className="bg-white border border-gray-300 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6">
             Doctor Notes
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">{DoctorNotes.token}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">{DoctorNotes.doctor}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">{DoctorNotes.DoctorNotes}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">{DoctorNotes.bp}</span>
              </div>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}