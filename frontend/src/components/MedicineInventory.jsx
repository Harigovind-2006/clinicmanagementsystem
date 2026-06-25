import React, { useState, useEffect } from "react";
import Layout from "./Layout";

export default function MedicineInventory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [errorMsg, setErrorMsg] = useState(""); 
  
  const [medicines, setMedicines] = useState([]);
  
  // --- Database Role State ---
  const [userRole, setUserRole] = useState("");
  const isManager = userRole === "manager" 

  const [form, setForm] = useState({
    medicinename: "",
    scientificname: "",
    unitcost: "",
    quantity: "",
  });

  // --- API Integrations ---

  useEffect(() => {
    // 1. Fetch User Role from DB
    const fetchUserRole = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await fetch(`http://localhost:5000/userapi/userget/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err);
      }
    };

    // 2. Fetch Medicines from DB
    const fetchMedicines = async () => {
      try {
        const response = await fetch("http://localhost:5000/medicineapi/medicineget");
        if (!response.ok) throw new Error("Failed to fetch medicines");
        const data = await response.json();
        setMedicines(data);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchUserRole();
    fetchMedicines();
  }, []);

  // --- Handlers ---

  const handleAddMedicine = async () => {
    if (!isManager) {
      alert("Access Denied: You do not have permission to add medicine items.");
      return;
    }

    if (!form.medicinename || !form.scientificname || !form.unitcost || !form.quantity) {
      setErrorMsg("All fields are required. Please fill out every field.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/medicineapi/medicinein", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicinename: form.medicinename,
          scientificname: form.scientificname,
          unitcost: Number(form.unitcost),
          quantity: Number(form.quantity),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to add medicine on the backend.");
      
      closeModals();
      
      // Re-fetch to update table with the new M00x ID
      const refresh = await fetch("http://localhost:5000/medicineapi/medicineget");
      setMedicines(await refresh.json());
      
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const openEditModal = (medicine) => {
    if (!isManager) return;
    setSelectedMedicine(medicine);
    setForm({
      medicinename: medicine.medicinename,
      scientificname: medicine.scientificname,
      unitcost: medicine.unitcost,
      quantity: medicine.quantity,
    });
    setErrorMsg("");
    setShowEditModal(true);
  };

  const handleUpdateMedicine = async () => {
    if (!isManager) return;

    if (!form.medicinename || !form.scientificname || !form.unitcost || !form.quantity) {
      setErrorMsg("All fields are required.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/medicineapi/update/medicine/${selectedMedicine._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicinename: form.medicinename,
          scientificname: form.scientificname,
          unitcost: Number(form.unitcost),
          quantity: Number(form.quantity),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update medicine.");
      
      closeModals();
      const refresh = await fetch("http://localhost:5000/medicineapi/medicineget");
      setMedicines(await refresh.json());
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (!isManager) return;
    
    if (window.confirm("Delete this medicine?")) {
      try {
        const response = await fetch(`http://localhost:5000/medicineapi/delete/medicine/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete medicine");
        
        const refresh = await fetch("http://localhost:5000/medicineapi/medicineget");
        setMedicines(await refresh.json());
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRestock = async (medicine) => {
    const qty = Number(prompt(`Enter quantity to add to ${medicine.medicinename}:`));
    if (!qty || qty <= 0) return;

    try {
      const response = await fetch(`http://localhost:5000/medicineapi/update/medicine/${medicine._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: medicine.quantity + qty,
        }),
      });

      if (!response.ok) throw new Error("Failed to restock");
      
      const refresh = await fetch("http://localhost:5000/medicineapi/medicineget");
      setMedicines(await refresh.json());
    } catch (err) {
      console.error(err);
      alert("Error restocking medicine");
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setErrorMsg("");
    setForm({ medicinename: "", scientificname: "", unitcost: "", quantity: "" });
    setSelectedMedicine(null);
  };

  // --- Filtering ---
  const lowStock = medicines.filter((m) => m.quantity < 50);
  const displayedMedicines = activeTab === "all" ? medicines : lowStock;

  const filteredMedicines = displayedMedicines.filter(
    (medicine) =>
      (medicine.medicinename || "").toLowerCase().includes(search.toLowerCase()) ||
      (medicine.scientificname || "").toLowerCase().includes(search.toLowerCase()) ||
      (medicine.mid || "").toLowerCase().includes(search.toLowerCase()) // Also allows searching by ID!
  );

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="w-full max-w-full block overflow-hidden bg-gray-50 p-4 md:p-6 lg:p-8 min-h-screen">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 w-full">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">Medicine Inventory</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 break-words">
              Role Permission Level: <span className="font-semibold text-blue-600 capitalize">{userRole || "Loading..."}</span>
            </p>
          </div>

          {isManager && (
            <button
              onClick={() => {
                setForm({ medicinename: "", scientificname: "", unitcost: "", quantity: "" });
                setShowAddModal(true);
              }}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition font-medium text-sm shadow-sm whitespace-nowrap self-start sm:self-auto"
            >
              + Add Medicine
            </button>
          )}
        </div>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${
              activeTab === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All Medicines ({medicines.length})
          </button>

          <button
            onClick={() => setActiveTab("low")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${
              activeTab === "low"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Low Stock ({lowStock.length})
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-200 w-full flex items-center gap-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search medicines by name, scientific name, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm text-gray-700 focus:outline-none"
          />
        </div>

        <div className="w-full max-w-full block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="w-full block overflow-x-auto">
            <table className="w-full min-w-[750px] border-collapse table-auto">
              <thead className="bg-gray-50/70 border-b border-gray-200">
                <tr>
                  {/* NEW ID COLUMN */}
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">ID</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Scientific Name</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Cost</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Quantity</th>
                  <th className="p-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pr-6 w-44">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredMedicines.map((medicine) => (
                  <tr key={medicine._id} className="hover:bg-gray-50/50 transition-colors whitespace-nowrap">
                    {/* NEW ID DISPLAY */}
                    <td className="p-4 text-sm font-bold text-gray-500 uppercase">{medicine.mid}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">{medicine.medicinename}</td>
                    <td className="p-4 text-sm text-gray-600 italic">{medicine.scientificname}</td>
                    <td className="p-4 text-sm text-gray-900 font-medium">₹{medicine.unitcost}</td>
                    <td className="p-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          medicine.quantity < 50
                            ? "bg-red-50 text-red-700 border-red-100"
                            : "bg-green-50 text-green-700 border-green-100"
                        }`}
                      >
                        {medicine.quantity} units
                      </span>
                    </td>
                    <td className="p-4 text-sm pr-6">
                      <div className="flex items-center justify-end gap-2">
                      {isManager && (<button
                          onClick={() => handleRestock(medicine)}
                          className={`px-3 py-1.5 border text-xs font-medium rounded-lg transition mr-2 ${
                            medicine.quantity < 50
                              ? "border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                              : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          Restock
                        </button>)}
                        

                        {isManager && (
                          
                          <button
                            onClick={() => openEditModal(medicine)}
                            title="Edit Medicine"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        )}

                        {isManager && (
                          <button
                            onClick={() => handleDeleteMedicine(medicine._id)}
                            title="Delete Medicine"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-14v4M1 7h22" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMedicines.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-sm text-gray-400 italic bg-white">
                      No medicines matched your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {(showAddModal || showEditModal) && isManager && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-100 transform transition-all">
              <h2 className="text-xl font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">
                {showAddModal ? "Add New Asset Data" : "Modify Inventory Listing"}
              </h2>

              {errorMsg && (
                <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium border border-red-100">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Medicine Details <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Generic/Commercial Name"
                    value={form.medicinename}
                    onChange={(e) => {
                      setForm({ ...form, medicinename: e.target.value });
                      setErrorMsg("");
                    }}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Scientific Name"
                    value={form.scientificname}
                    onChange={(e) => {
                      setForm({ ...form, scientificname: e.target.value });
                      setErrorMsg("");
                    }}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cost (Per Unit) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      placeholder="₹ Base Cost"
                      value={form.unitcost}
                      onChange={(e) => {
                        setForm({ ...form, unitcost: e.target.value });
                        setErrorMsg("");
                      }}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Initial Stock <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      placeholder="Units Available"
                      value={form.quantity}
                      onChange={(e) => {
                        setForm({ ...form, quantity: e.target.value });
                        setErrorMsg("");
                      }}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  onClick={closeModals}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={showAddModal ? handleAddMedicine : handleUpdateMedicine}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
                >
                  {showAddModal ? "Commit Registry" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}