import React, { useState, useEffect, useRef } from "react";
import api from "../../../api/axios";

export default function Procedure({ isSeniorDoctor = false, appointmentId }) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState("");
  const [procedureMaster, setProcedureMaster] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchProcedures();
    fetchAppointmentProcedures();
  }, []);

  const fetchProcedures = async () => {
    try {
      const res = await api.get("/procedureapi");
      console.log("Procedure API Response:", res.data);
      console.log("Procedure Data:", res.data.data);
      setProcedureMaster(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to fetch procedures:", err);
    }
  };

  const fetchAppointmentProcedures = async () => {
    if (!appointmentId) return;

    try {
      const res = await api.get(`/appoinmentapi/${appointmentId}`);
      const appointment = res.data.data || res.data;

      setProcedures(
        (appointment.procedure || []).map((p) => ({
          procedureId: p._id,
          procedureName: p.procedureName,
          amount: p.amount,
          done: false,
        }))
      );

    } catch (err) {
      console.error("Error fetching appointment procedures:", err);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProcedures = procedureMaster.filter((procedure) => {
    const isAlreadyAdded = procedures.some(
      (p) => p.procedureId === procedure._id
    );
    return (
      !isAlreadyAdded &&
      procedure.procedureName?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddProcedure = async () => {
    if (!selectedProcedure) {
      alert("Please select a procedure from the dropdown list.");
      return;
    }

    const procedure = procedureMaster.find((p) => p._id === selectedProcedure);
    if (!procedure) {
      alert("Selected procedure not found.");
      return;
    }

    const isAlreadyAdded = procedures.some(
      (p) => p.procedureId === procedure._id
    );
    if (isAlreadyAdded) {
      alert("This procedure has already been added.");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/appoinmentapi/${appointmentId}/add-procedure`, {
        procedureId: procedure._id,
      });

      await fetchAppointmentProcedures();

      setSearch("");
      setSelectedProcedure("");
      setShowDropdown(false);
    } catch (error) {
      console.error("Error adding procedure:", error);
      alert(error.response?.data?.message || "Failed to add procedure. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markProcedureDone = async (index) => {
    const updated = [...procedures];
    updated[index] = { ...updated[index], done: true };
    setProcedures(updated);
  };

  const handleDelete = async (index) => {
    try {
      const proc = procedures[index];
      
      if (!proc) return;
      
      if (!window.confirm(`Are you sure you want to remove "${proc.procedureName}"?`)) {
        return;
      }

      setLoading(true);

      await api.delete(
        `/appoinmentapi/${appointmentId}/remove-procedure/${proc.procedureId}`
      );

      await fetchAppointmentProcedures();

    } catch (err) {
      console.error("Error deleting procedure:", err);
      alert(err.response?.data?.message || "Failed to delete procedure. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Add Procedure</h2>

          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Procedure *</label>

            <input
              type="text"
              placeholder="Search procedure..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
            />

            {showDropdown && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredProcedures.length > 0 ? (
                  filteredProcedures.map((procedure) => (
                    <div
                      key={procedure._id}
                      onClick={() => {
                        setSelectedProcedure(procedure._id);
                        setSearch(procedure.procedureName);
                        setShowDropdown(false);
                      }}
                      className="p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50 last:border-none"
                    >
                      <p className="font-medium text-sm text-gray-800">{procedure.procedureName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">₹{procedure.amount}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-400 text-center">
                    {search ? "No matching procedures found" : "No procedures available"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleAddProcedure}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors mt-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Procedure"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Current Procedures</h2>

        {procedures.length === 0 ? (
          <div className="text-center my-auto py-12 text-gray-400 text-sm">
            No procedures added yet
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[335px] pr-1 flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-400 sticky top-0 bg-white z-10">
                  <th className="pb-3">Procedure</th>
                  <th className="pb-3">Amount</th>
                  {isSeniorDoctor ? (
                    <th className="pb-3 text-right">Action</th>
                  ) : (
                    <>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {procedures.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/40 transition-colors">
                    <td className="py-3.5 pr-2 font-medium text-gray-900">{item.procedureName}</td>
                    <td className="py-3.5 text-gray-500">₹{item.amount}</td>

                    {isSeniorDoctor ? (
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDelete(index)}
                          disabled={loading}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </td>
                    ) : (
                      <>
                        <td className="py-3.5">
                          {item.done ? (
                            <span className="inline-flex px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                              Done
                            </span>
                          ) : (
                            <span className="inline-flex px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 text-right">
                          {!item.done ? (
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => markProcedureDone(index)}
                                className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-xs transition-colors"
                              >
                                Mark Done
                              </button>
                              <button
                                onClick={() => handleDelete(index)}
                                disabled={loading}
                                className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium rounded-lg text-xs transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-green-600 font-medium pr-2">Completed ✓</span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}