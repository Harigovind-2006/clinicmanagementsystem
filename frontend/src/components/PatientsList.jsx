import React from "react";
import { Link } from "react-router-dom";

const patients = [
  {
    pid: "P001",
    name: "John Doe",
    phone: "7356164455",
    gender: "Male",
    type: "OP",
  },
  {
    pid: "P002",
    name: "Mathew Joseph",
    phone: "7356163399",
    gender: "Male",
    type: "OP",
  },
  {
    pid: "P003",
    name: "Daniel Joshy",
    phone: "7356164488",
    gender: "Male",
    type: "IP",
  },
  {
    pid: "P004",
    name: "Afiya Fathima",
    phone: "9061078888",
    gender: "Female",
    type: "IP",
  },
];

export default function PatientsList() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 ml-20">
    
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Patient Records
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and view all patient information
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b">
              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                PID
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                Name
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                Phone
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                Gender
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                Type
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.pid}
                className="border-b border-slate-200 hover:bg-slate-50 transition duration-200"
              >
                <td className="px-6 py-4 font-medium text-slate-700">
                  {patient.pid}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  {patient.name}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  {patient.phone}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  {patient.gender}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      patient.type === "OP"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {patient.type}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <Link
                    to={`/patientsdetails/${patient.pid}`}
                    className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}   