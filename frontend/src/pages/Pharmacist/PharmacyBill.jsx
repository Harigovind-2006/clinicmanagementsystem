import React from "react";

const PharmacyBill = React.forwardRef(({ patient, medicines, onQtyChange, onConfirm }, ref) => {
  // Fallback fallback mock data matching your image structure exactly if no props are passed
  const displayPatient = {
    pid: patient?.pid || "P001",
    name: patient?.name || "John Doe",
    bloodGroup: patient?.bloodGroup || "O+",
    type: patient?.type || "OP",
  };

  const displayMedicines = medicines?.length > 0 ? medicines : [
    {
      medicineId: "1",
      medicine: "Atorvastatin",
      genericName: "Atorvastatin Calcium",
      days: "—",
      frequency: "—",
      dispensedQty: "",
      unitCost: "35",
      status: "Pending"
    }
  ];

  return (
    <div ref={ref} className="bg-[#f8fafc] min-h-screen p-6 font-sans text-gray-900">
      {/* Main Container mirroring the visual card layout */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-base font-normal mb-8">
          <span className="text-[#2563eb] font-semibold cursor-pointer">
            Patient Medicines
          </span>
          <span className="text-gray-400 font-light">&gt;</span>
          <span className="text-gray-700">
            {displayPatient.name}
          </span>
        </div>

        {/* Patient Details Info Block */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 border border-gray-200 rounded-2xl mb-8 bg-white">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">PID</p>
            <p className="text-[15px] font-medium text-gray-800">{displayPatient.pid}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Name</p>
            <p className="text-[15px] font-medium text-gray-800">{displayPatient.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Blood Group</p>
            <p className="text-[15px] font-medium text-gray-800">{displayPatient.bloodGroup}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Type</p>
            <p className="text-[15px] font-medium text-gray-800">{displayPatient.type}</p>
          </div>
        </div>

        {/* Inner Content Card Box */}
        <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          {/* Section Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Prescription Dispensing
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Enter the quantity dispensed for each medicine
            </p>
          </div>

          {/* Medicines Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="pb-3 text-sm font-semibold text-gray-500 w-1/4">Medicine</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Days</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Frequency / Instructions</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Dispensed Qty</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Unit Cost</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {displayMedicines.map((item, index) => (
                  <tr key={item.medicineId || index} className="align-middle">
                    <td className="py-5 pr-4">
                      <p className="font-semibold text-gray-800 text-[15px]">
                        {item.medicine}
                      </p>
                      <p className="text-xs italic text-gray-400 font-normal mt-0.5">
                        {item.genericName}
                      </p>
                    </td>
                    <td className="py-5 text-gray-700 text-[15px]">{item.days}</td>
                    <td className="py-5 text-gray-700 text-[15px]">{item.frequency}</td>
                    <td className="py-5">
                      {/* Styled Input Box matching image design */}
                      <input
                        type="text"
                        placeholder="Enter qty"
                        value={item.dispensedQty}
                        onChange={(e) => onQtyChange && onQtyChange(item.medicineId, e.target.value)}
                        className="w-28 px-3 py-1.5 border border-gray-300 rounded-xl text-sm font-normal text-gray-700 placeholder-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </td>
                    <td className="py-5 text-gray-700 text-[15px]">Rs. {item.unitCost}</td>
                    <td className="py-5">
                      <span className="px-2.5 py-1 rounded-md bg-[#fef3c7] text-[#b45309] text-xs font-medium">
                        {item.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Note and Call to Action */}
          <div className="mt-8 pt-4 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-400 max-w-xl">
              After confirming, the billing amount will be sent to Front Office for payment collection.
            </p>
            <button 
              onClick={onConfirm}
              className="bg-[#0052cc] hover:bg-[#0747a6] text-white px-6 py-2.5 rounded-xl font-semibold text-[15px] transition flex items-center justify-center gap-2 shadow-sm self-end sm:self-auto"
            >
              {/* Checkmark icon mimicking the UI design */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Confirm Dispensing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
});

PharmacyBill.displayName = "PharmacyBill";

export default PharmacyBill;