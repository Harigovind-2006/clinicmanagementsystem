import React from "react";

export default function Overview({ patient, setPatient }) {
  function handleDischarge() {
    setPatient({
      ...patient,
      type: "OP",
    });
  }
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left Section */}
      <div className="xl:col-span-2 space-y-6">
        {/* Patient Profile */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-5">
            Patient Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-gray-500 text-sm">
                Patient ID
              </p>
              <p className="font-semibold text-lg">
                {patient.pid}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Name
              </p>
              <p className="font-semibold text-lg">
                {patient.pname}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Gender
              </p>
              <p className="font-semibold text-lg">
                {patient.gender}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Blood Group
              </p>
              <p className="font-semibold text-lg">
                {patient.blood}
              </p>
            </div>
          </div>
        </div>

        {/* Vitals */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-5">
            Latest Vitals
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">
                BP
              </p>

              <h3 className="text-xl font-bold text-blue-600">
                120/80
              </h3>
            </div>

            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">
                Pulse
              </p>

              <h3 className="text-xl font-bold text-green-600">
                72 bpm
              </h3>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">
                Temp
              </p>

              <h3 className="text-xl font-bold text-orange-600">
                98.6°F
              </h3>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">
                Weight
              </p>

              <h3 className="text-xl font-bold text-purple-600">
                75 kg
              </h3>
            </div>
          </div>
        </div>

        {/* Doctor Notes */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">
            Doctor Notes
          </h2>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium text-gray-800 mb-2">
              Dr. Amit Sharma
            </p>

            <p className="text-gray-600">
              Patient recovering well and showing
              positive response to treatment.
              Continue prescribed medication and
              observe vitals regularly.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="space-y-6">
        {/* Consultation Notes */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">
            Consultation Notes
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Patient recovering well. No major
            complications observed during the latest
            consultation. Follow-up recommended.
          </p>
        </div>

        {/* Observations */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">
            Clinical Observations
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Patient is stable and responding well to
            medication. Appetite improved and vital
            signs remain within normal range.
          </p>
        </div>
      </div>
    </div>
  );
}