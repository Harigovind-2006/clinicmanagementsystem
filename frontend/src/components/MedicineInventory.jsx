import React, { useState } from "react";
import Layout from "./Layout";

export default function MedicineInventory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const [medicines, setMedicines] = useState([
    {
      id: "M001",
      name: "Paracetamol",
      scientificName: "Acetaminophen",
      unitCost: 10,
      quantity: 250,
    },
    {
      id: "M002",
      name: "Augmentin",
      scientificName: "Amoxicillin + Clavulanic Acid",
      unitCost: 35,
      quantity: 40,
    },
    {
      id: "M003",
      name: "Metformin",
      scientificName: "Metformin Hydrochloride",
      unitCost: 15,
      quantity: 20,
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    scientificName: "",
    unitCost: "",
    quantity: "",
  });

  const lowStock = medicines.filter((m) => m.quantity < 50);
  const displayedMedicines = activeTab === "all" ? medicines : lowStock;

  const filteredMedicines = displayedMedicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(search.toLowerCase()) ||
      medicine.scientificName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMedicine = () => {
    const newMedicine = {
      id: `M${String(medicines.length + 1).padStart(3, "0")}`,
      name: form.name,
      scientificName: form.scientificName,
      unitCost: Number(form.unitCost),
      quantity: Number(form.quantity),
    };

    setMedicines([...medicines, newMedicine]);
    setForm({ name: "", scientificName: "", unitCost: "", quantity: "" });
    setShowAddModal(false);
  };

  const openEditModal = (medicine) => {
    setSelectedMedicine(medicine);
    setForm({
      name: medicine.name,
      scientificName: medicine.scientificName,
      unitCost: medicine.unitCost,
      quantity: medicine.quantity,
    });
    setShowEditModal(true);
  };

  const handleUpdateMedicine = () => {
    setMedicines(
      medicines.map((medicine) =>
        medicine.id === selectedMedicine.id
          ? {
              ...medicine,
              name: form.name,
              scientificName: form.scientificName,
              unitCost: Number(form.unitCost),
              quantity: Number(form.quantity),
            }
          : medicine
      )
    );
    setShowEditModal(false);
  };

  const handleDeleteMedicine = (id) => {
    if (window.confirm("Delete this medicine?")) {
      setMedicines(medicines.filter((medicine) => medicine.id !== id));
    }
  };

  const handleRestock = (id) => {
    const qty = Number(prompt("Enter quantity"));
    if (!qty || qty <= 0) return;

    setMedicines(
      medicines.map((medicine) =>
        medicine.id === id
          ? { ...medicine, quantity: medicine.quantity + qty }
          : medicine
      )
    );
  };

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medicine Inventory</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor and manage pharmaceutical stock levels</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition font-medium text-sm shadow-sm"
          >
            + Add Medicine
          </button>
        </div>

        {/* Filters & Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All Medicines ({medicines.length})
          </button>

          <button
            onClick={() => setActiveTab("low")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === "low"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Low Stock ({lowStock.length})
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-200">
          <input
            type="text"
            placeholder="Search medicines by name or scientific structure..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50"
          />
        </div>

        {/* Desktop Data Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50/70 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Scientific Name</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="p-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pr-6">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredMedicines.map((medicine) => (
                  <tr key={medicine.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900">{medicine.name}</td>
                    <td className="p-4 text-sm text-gray-600 italic">{medicine.scientificName}</td>
                    <td className="p-4 text-sm text-gray-900 font-medium">₹{medicine.unitCost}</td>
                    <td className="p-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          medicine.quantity < 50
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {medicine.quantity} units
                      </span>
                    </td>
                    <td className="p-4 text-sm pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* Restock Trigger Button */}
                        <button
                          onClick={() => handleRestock(medicine.id)}
                          className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition mr-2"
                        >
                          Restock
                        </button>

                        {/* Interactive Edit Button */}
                        <button
                          onClick={() => openEditModal(medicine)}
                          title="Edit Medicine"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        {/* Interactive Delete Button */}
                        <button
                          onClick={() => handleDeleteMedicine(medicine.id)}
                          title="Delete Medicine"
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-14v4M1 7h22" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMedicines.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-sm text-gray-400 italic">
                      No medicines matched your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Form Modal Wrapper */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl border border-gray-100 transform transition-all">
              <h2 className="text-xl font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">
                {showAddModal ? "Add New Asset Data" : "Modify Inventory Listing"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Medicine Details</label>
                  <input
                    type="text"
                    placeholder="Generic/Commercial Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Active Ingredients / Structural Compound Name"
                    value={form.scientificName}
                    onChange={(e) => setForm({ ...form, scientificName: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cost (Per Unit)</label>
                    <input
                      type="number"
                      placeholder="₹ Base Cost"
                      value={form.unitCost}
                      onChange={(e) => setForm({ ...form, unitCost: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Initial Stock</label>
                    <input
                      type="number"
                      placeholder="Units Available"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={showAddModal ? handleAddMedicine : handleUpdateMedicine}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-100"
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