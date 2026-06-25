import React, { useState, useEffect } from "react";
import Layout from "./Layout";

export default function ProcedureInventory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [procedures, setProcedures] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [form, setForm] = useState({
  procedureName: "",
  amount: "",
});

  const isManager = userRole === "manager" || userRole === "pharmacist";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    const userId = localStorage.getItem("userId");

    if (userId) {
      const userRes = await fetch(
        `http://localhost:5000/userapi/userget/${userId}`
      );

      if (userRes.ok) {
        const userData = await userRes.json();
        setUserRole(userData.role);
      }
    }

    const res = await fetch("http://localhost:5000/procedureapi");
const data = await res.json();

if (res.ok) {
    setProcedures(data.data);
}
  } catch (err) {
    console.error("Fetch Error:", err);
  }
};

  const handleToggleStatus = async (item) => {
    try {
      await fetch(`http://localhost:5000/procedureapi/update/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProcedure = async (id) => {
    if (!window.confirm("Delete this procedure?")) return;
    try {
      await fetch(`http://localhost:5000/procedureapi/delete/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOrUpdate = async () => {
    const url = showAddModal 
      ? "http://localhost:5000/procedureapi/" 
      : `http://localhost:5000/procedureapi/update/${selectedProcedure._id}`;
    
    try {
      const res = await fetch(url, {
        method: showAddModal ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        closeModals();
        fetchData();
      } else {
        setErrorMsg("Failed to save. Please check inputs.");
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setForm({ procedureName: "", amount: "" });
    setErrorMsg("");
  };

  // Sorting Logic: Active procedures at the top
  const sortedProcedures = Array.isArray(procedures)
  ? [...procedures].sort((a, b) => Number(b.isActive) - Number(a.isActive))
  : [];

  const filteredProcedures = sortedProcedures.filter(
    (p) =>
      (p.procedureName || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.prid || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Procedure Inventory</h1>
          <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold">
            + Add Procedure
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-200 flex items-center gap-3">
          <input
            type="text"
            placeholder="Search procedure by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm focus:outline-none"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left text-xs font-bold uppercase">ID</th>
                <th className="p-4 text-left text-xs font-bold uppercase">Procedure Name</th>
                <th className="p-4 text-left text-xs font-bold uppercase">Cost</th>
                <th className="p-4 text-left text-xs font-bold uppercase">Status</th>
                <th className="p-4 text-right text-xs font-bold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProcedures.map((item) => (
                <tr key={item._id} className={`border-b hover:bg-gray-50 ${!item.isActive ? "bg-gray-50" : ""}`}>
                  <td className="p-4 font-bold text-gray-500">{item.prid}</td>
                  <td className="p-4 font-medium">{item.procedureName}</td>
                  <td className="p-4">₹{item.amount }</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {item.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleToggleStatus(item)} className={`px-3 py-1 rounded-lg text-xs text-white ${item.isActive ? "bg-red-600" : "bg-green-600"}`}>
                        {item.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => { setSelectedProcedure(item); setForm({ procedureName: item.procedureName, amount: item.amount }); setShowEditModal(true); }} className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs">Edit</button>
                      <button onClick={() => handleDeleteProcedure(item._id)} className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-5">{showAddModal ? "Add Procedure" : "Edit Procedure"}</h2>
              {errorMsg && <div className="mb-4 text-red-600 text-sm">{errorMsg}</div>}
              <input type="text" placeholder="Procedure Name" value={form.procedureName} onChange={(e) => setForm({ ...form, procedureName: e.target.value })} className="w-full border rounded-xl p-3 mb-4" />
              <input type="number" placeholder="Procedure Cost" value={form.amount} onChange={(e) => setForm({ ...form, amount : e.target.value })} className="w-full border rounded-xl p-3" />
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={closeModals} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button onClick={handleAddOrUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-xl">{showAddModal ? "Add" : "Save Changes"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}