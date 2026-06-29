import React, { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Eye, EyeOff, X, Check } from "lucide-react";
import Layout from "./Layout";

// Role mapping to align UI display with backend database schema strings
const roleMap = {
  "Manager": "manager",
  "Front Office Staff": "fos",
  "Senior Doctor": "seniordoctor",
  "Junior Doctor": "juniordoctor",
  "Nurse": "nurse",
  "Pharmacist": "pharmacist",
};

// Reverse mapping for display layout when pulling records out of the database
const reverseRoleMap = {
  manager: "Manager",
  fos: "Front Office Staff",
  seniordoctor: "Senior Doctor",
  juniordoctor: "Junior Doctor",
  nurse: "Nurse",
  pharmacist: "Pharmacist",
};

const specializationsList = [
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Dermatology",
  "Pediatrics",
  "Gynaecology",
  "ENT",
  "Ophthalmology",
  "General Surgery"
];

export default function Users() {
  const [search, setSearch] = useState("");
  const [designation, setDesignation] = useState("All Designations");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [step, setStep] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const initialUserState = {
    fullName: "",
    dob: "",
    mobile: "",
    email: "",
    aadhaar: "",
    pan: "",
    gender: "",
    designation: "",
    specialization: "",
    address: "",
    username: "",
    password: "",
  };

  const [userData, setUserData] = useState(initialUserState);

  // --- API Integrations ---

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/userapi");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setErrorMsg("Could not sync data with backend server.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleNextStep = () => {
    if (
      !userData.fullName.trim() ||
      !userData.dob ||
      !userData.mobile.trim() ||
      !userData.email.trim() ||
      !userData.aadhaar.trim() ||
      !userData.pan.trim() ||
      !userData.gender ||
      !userData.designation ||
      !userData.address.trim()
    ) {
      setErrorMsg("All personal and role details are required.");
      return;
    }

    if (userData.designation === "Senior Doctor" && !userData.specialization) {
      setErrorMsg("Please select a specialization for the Senior Doctor.");
      return;
    }

    setErrorMsg("");
    setStep(2);
  };

  const handleSaveUser = async () => {
    if (!userData.username.trim() || !userData.password.trim()) {
      setErrorMsg("Username and Password are required to create an account.");
      return;
    }

    try {
      // Build dynamic payload to avoid enum validation errors
      const payload = {
        fullname: userData.fullName,
        username: userData.username,
        password: userData.password,
        email: userData.email,
        pan: userData.pan,
        dob: userData.dob,
        mobile: userData.mobile,
        adhaar: userData.aadhaar,
        role: roleMap[userData.designation],
        address: userData.address,
        gender: userData.gender.toLowerCase(),
      };

      // Only attach specialisation if the role requires it
      if (payload.role === "seniordoctor") {
        payload.specialisation = userData.specialization;
      }

      const response = await fetch("http://localhost:5000/userapi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong while inserting the user.");
      }

      setUserData(initialUserState);
      setShowAddUserModal(false);
      setStep(1);
      setErrorMsg("");
      setShowPassword(false);
      fetchUsers(); 
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditData({ ...user });
    setErrorMsg("");
    setShowEditModal(true);
  };

  const toggleStatus = async (user) => {
    try {
      const updatedStatus = user.status === "Active" ? "Inactive" : "Active";
      const response = await fetch(`http://localhost:5000/userapi/update/user/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!response.ok) throw new Error("Failed to change user status.");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`http://localhost:5000/userapi/delete/user/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove user account.");
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!editData) return;

    if (!editData.fullname || !editData.mobile || !editData.email) {
      setErrorMsg("Name, Mobile, and Email are mandatory.");
      return;
    }

    try {
      // Build dynamic payload for updates
      const updatePayload = {
        fullname: editData.fullname,
        mobile: editData.mobile,
        email: editData.email,
        dob: editData.dob,
        gender: editData.gender ? editData.gender.toLowerCase() : "",
        role: editData.role,
        address: editData.address,
      };

      // Only attach specialisation if the role is Senior Doctor
      if (updatePayload.role === "seniordoctor") {
        updatePayload.specialisation = editData.specialisation;
      }

      const response = await fetch(`http://localhost:5000/userapi/update/user/${editData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to submit updates.");

      setShowEditModal(false);
      setErrorMsg("");
      fetchUsers();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // --- Search Filtering Processing ---
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.fullname || "").toLowerCase().includes(search.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(search.toLowerCase());

    const mappedFilterDesignation = roleMap[designation];
    const matchesDesignation =
      designation === "All Designations" || user.role === mappedFilterDesignation;

    return matchesSearch && matchesDesignation;
  });

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto min-h-screen">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage clinic staff, roles, and records</p>
          </div>

          <button
            onClick={() => {
              setUserData(initialUserState);
              setErrorMsg("");
              setStep(1);
              setShowAddUserModal(true);
            }}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Search + Filter */}
          <div className="p-5 flex flex-col lg:flex-row justify-between gap-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-2 w-full lg:w-96 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="outline-none w-full text-sm text-gray-700 placeholder-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option>All Designations</option>
              <option>Manager</option>
              <option>Front Office Staff</option>
              <option>Pharmacist</option>
              <option>Nurse</option>
              <option>Junior Doctor</option>
              <option>Senior Doctor</option>
            </select>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm text-left">
              <thead className="bg-white border-b border-gray-200">
                <tr className="text-gray-500 font-semibold uppercase tracking-wider text-xs">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Designation</th>
                  <th className="px-5 py-4">Mobile</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4 w-28">Status</th>
                  <th className="px-5 py-4 text-right pr-6">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      <div>{user.fullname}</div>
                      {user.specialisation && user.specialisation !== "-" && (
                        <div className="text-xs text-gray-500 italic mt-0.5">{user.specialisation}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      {reverseRoleMap[user.role] || user.role}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{user.mobile}</td>
                    <td className="px-5 py-4 text-gray-600">{user.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          user.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {user.status || "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(user)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                            user.status === "Active"
                              ? "border-red-200 text-red-600 hover:bg-red-50"
                              : "border-green-200 text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {user.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          className="text-gray-400 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(user._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 bg-gray-50/30">
                      No users found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: ADD USER (MULTI-STEP WIZARD) */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[95vh] lg:max-h-[85vh]">
              
              <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Add New User</h2>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                
                {/* Stepper */}
                <div className="flex items-center justify-center mb-8 max-w-md mx-auto">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {step === 2 ? <Check className="w-4 h-4" strokeWidth={3} /> : "1"}
                    </div>
                    <span className={`text-sm font-semibold ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Personal Details</span>
                  </div>
                  <div className="w-16 h-px bg-gray-200 mx-4"></div>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      2
                    </div>
                    <span className={`text-sm font-semibold ${step === 2 ? 'text-gray-900' : 'text-gray-400'}`}>Credentials</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{errorMsg}
                  </div>
                )}

                {/* STEP 1: DETAILS */}
                {step === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={userData.fullName}
                        onChange={(e) => { setUserData({ ...userData, fullName: e.target.value }); setErrorMsg(""); }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        max={yesterday.toISOString().split("T")[0]}
                        value={userData.dob}
                        onChange={(e) => { setUserData({ ...userData, dob: e.target.value }); setErrorMsg(""); }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Gender <span className="text-red-500">*</span></label>
                      <select
                        value={userData.gender}
                        onChange={(e) => { setUserData({ ...userData, gender: e.target.value }); setErrorMsg(""); }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Mobile <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={userData.mobile}
                        onChange={(e) => { setUserData({ ...userData, mobile: e.target.value.replace(/\D/g, '') }); setErrorMsg(""); }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Email <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => { setUserData({ ...userData, email: e.target.value }); setErrorMsg(""); }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Aadhaar Number <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        maxLength={12}
                        value={userData.aadhaar}
                        onChange={(e) => { setUserData({ ...userData, aadhaar: e.target.value.replace(/\D/g, '') }); setErrorMsg(""); }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">PAN Number <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={userData.pan}
                        onChange={(e) => { setUserData({ ...userData, pan: e.target.value.toUpperCase() }); setErrorMsg(""); }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Job Role / Designation <span className="text-red-500">*</span></label>
                      <select
                        value={userData.designation}
                        onChange={(e) => { setUserData({ ...userData, designation: e.target.value, specialization: "" }); setErrorMsg(""); }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Role...</option>
                        <option>Manager</option>
                        <option>Front Office Staff</option>
                        <option>Pharmacist</option>
                        <option>Nurse</option>
                        <option>Junior Doctor</option>
                        <option>Senior Doctor</option>
                      </select>
                    </div>

                    {userData.designation === "Senior Doctor" ? (
                      <div className="animate-in fade-in">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Specialization <span className="text-red-500">*</span></label>
                        <select
                          value={userData.specialization}
                          onChange={(e) => { setUserData({ ...userData, specialization: e.target.value }); setErrorMsg(""); }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select Specialization...</option>
                          {specializationsList.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="hidden sm:block"></div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Postal Address <span className="text-red-500">*</span></label>
                      <textarea
                        rows={2}
                        value={userData.address}
                        onChange={(e) => { setUserData({ ...userData, address: e.target.value }); setErrorMsg(""); }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: CREDENTIALS */}
                {step === 2 && (
                  <div className="max-w-md mx-auto py-4 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Account For</p>
                        <p className="text-sm font-bold text-gray-900">{userData.fullName}</p>
                      </div>
                      <div className="flex-1 border-l border-blue-200 pl-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Role</p>
                        <p className="text-sm font-bold text-gray-900">{userData.designation}</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Login Username <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={userData.username}
                          onChange={(e) => { setUserData({ ...userData, username: e.target.value }); setErrorMsg(""); }}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Create a unique username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={userData.password}
                            onChange={(e) => { setUserData({ ...userData, password: e.target.value }); setErrorMsg(""); }}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Create a secure password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex justify-between items-center mt-8 pt-5 border-t border-gray-100">
                  {step === 1 ? (
                    <button
                      onClick={() => setShowAddUserModal(false)}
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  )}

                  {step === 1 ? (
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveUser}
                      className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
                    >
                      Create Account
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* MODAL: EDIT USER */}
        {showEditModal && editData && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
              
              <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Edit User Details</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {errorMsg && (
                  <div className="mb-5 bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={editData.fullname || ""}
                      onChange={(e) => { setEditData({ ...editData, fullname: e.target.value }); setErrorMsg(""); }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Mobile <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={editData.mobile || ""}
                      onChange={(e) => { setEditData({ ...editData, mobile: e.target.value.replace(/\D/g, '') }); setErrorMsg(""); }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={editData.email || ""}
                      onChange={(e) => { setEditData({ ...editData, email: e.target.value }); setErrorMsg(""); }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      max={yesterday.toISOString().split("T")[0]}
                      value={editData.dob ? editData.dob.split("T")[0] : ""}
                      onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Gender</label>
                    <select
                      value={editData.gender ? editData.gender.charAt(0).toUpperCase() + editData.gender.slice(1) : ""}
                      onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Designation</label>
                    <select
                      value={editData.role || ""}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value, specialisation: "-" })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="manager">Manager</option>
                      <option value="fos">Front Office Staff</option>
                      <option value="pharmacist">Pharmacist</option>
                      <option value="nurse">Nurse</option>
                      <option value="juniordoctor">Junior Doctor</option>
                      <option value="seniordoctor">Senior Doctor</option>
                    </select>
                  </div>

                  {editData.role === "seniordoctor" ? (
                    <div className="animate-in fade-in">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Specialization <span className="text-red-500">*</span></label>
                      <select
                        value={editData.specialisation || ""}
                        onChange={(e) => setEditData({ ...editData, specialisation: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Specialization</option>
                        {specializationsList.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="hidden sm:block"></div>
                  )}

                  <div className="sm:col-span-2 mt-1">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Postal Address</label>
                    <textarea
                      rows={2}
                      value={editData.address || ""}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 mt-6 pt-5">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateUser}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}