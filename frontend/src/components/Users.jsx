import {useState} from "react";
import {Search,Plus,Pencil,Trash2} from "lucide-react";
import Layout from "./Layout";

const usersData = [
    {
    id: 1,
    name: "Dr. Amit Sharma",
    designation: "Senior Doctor",
    mobile: "9811234567",
    email: "amit@clinic.com",
    specialization: "Cardiology",
    dob: "1980-05-12",
    aadhaar: "123456789012",
    pan: "AMITS1234K",
    gender: "Male",
    address: "MG Road, Kochi, Kerala",
  },
  {
    id: 2,
    name: "Dr. Priya Verma",
    designation: "Senior Doctor",
    mobile: "9822345678",
    email: "priya@clinic.com",
    specialization: "General Medicine",
    dob: "1984-09-21",
    aadhaar: "234567890123",
    pan: "PRIYA5678L",
    gender: "Female",
    address: "Civil Lines, Delhi",
  },
  {
    id: 3,
    name: "Dr. Rahul Kumar",
    designation: "Junior Doctor",
    mobile: "9833456789",
    email: "rahul@clinic.com",
    specialization: "Orthopedics",
    dob: "1992-03-15",
    aadhaar: "345678901234",
    pan: "RAHUL3456M",
    gender: "Male",
    address: "Banjara Hills, Hyderabad",
  },
  {
    id: 4,
    name: "Dr. Neha Singh",
    designation: "Junior Doctor",
    mobile: "9844567890",
    email: "neha@clinic.com",
    specialization: "Dermatology",
    dob: "1993-07-08",
    aadhaar: "456789012345",
    pan: "NEHAS7890N",
    gender: "Female",
    address: "Indiranagar, Bengaluru",
  },
  {
    id: 5,
    name: "Sunita Devi",
    designation: "Nurse",
    mobile: "9855678901",
    email: "sunita@clinic.com",
    specialization: "-",
    dob: "1990-11-25",
    aadhaar: "567890123456",
    pan: "SUNIT1234P",
    gender: "Female",
    address: "Salt Lake, Kolkata",
  },
  {
    id: 6,
    name: "Kavita Rao",
    designation: "Nurse",
    mobile: "9866789012",
    email: "kavita@clinic.com",
    specialization: "-",
    dob: "1988-02-18",
    aadhaar: "678901234567",
    pan: "KAVIT5678Q",
    gender: "Female",
    address: "Anna Nagar, Chennai",
  },
];

export default function Users(){
    const [search, setSearch] = useState("");
    const [designation, setDesignation] = useState("All Designations");
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [step, setStep] = useState(1);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const [editData, setEditData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [users, setUsers] = useState(usersData);
    const [userData, setUserData] = useState({
        fullName:"",
        dob:"",
        mobile:"",
        email:"",
        aadhaar:"",
        pan:"",
        gender:"",
        designation:"Junior Doctor",
        address:"",

        username: "",
        password: "",
        confirmPassword: "",
    });

    const filteredUsers = users.filter((user) => {
        const matchesSearch = (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
                            (user.email || "").toLowerCase().includes(search.toLowerCase());

        const matchesDesignation = 
                designation ==="All Designations" ||
                user.designation === designation;

        return matchesSearch && matchesDesignation;
    });

    const handleNext = () => {
        if (!userData.fullName.trim()) {
            alert("Full Name is required");
            return;
        }

        if (!userData.mobile.trim()) {
            alert("Mobile Number is required");
            return;
        }

        setStep(2);
    };


    const handleSaveUser = () => {
        if (!userData.username.trim()) {
            alert("Username is required");
        return;
        }

        if (!userData.password.trim()) {
            alert("Password is required");
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            alert("Passwords do not match");
                return;
            }

        console.log("User Data:", userData);
        const newUser = {
            id: Date.now(),
            name: userData.fullName,
            designation: userData.designation,
            mobile: userData.mobile,
            email: userData.email,
            specialization: "",
            dob: userData.dob,
            aadhaar: userData.aadhaar,
            pan: userData.pan,
            gender: userData.gender,
            address: userData.address,
        };

        setUsers([...users, newUser]);
        setUserData({
            fullName:"",
            dob:"",
            mobile:"",
            email:"",
            aadhaar:"",
            pan:"",
            gender:"",
            designation:"Junior Doctor",
            address:"",
            username:"",
            password:"",
            confirmPassword:"",
        });

        alert("User Added Successfully");

        setShowAddUserModal(false);
        setStep(1);
    };

    const handleEdit = (user) => {
        setEditData({ ...user });
        setShowEditModal(true);
    };

    const handleDelete = (id) =>{
        setUsers(users.filter((user) =>
            user.id !==id));
    };

    const handleUpdateUser = () => {
        if (!editData) return;

        const updatedUsers = users.map((user) =>
            user.id === editData.id
            ? editData
            : user
        );

        setUsers(updatedUsers);
        setShowEditModal(false);
    };

    return (
        <Layout>
            <div className = "space-y-6">
                {/*Header*/}
                <div className = "flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Users
                    </h1>

                    <button onClick = {() => {
                        setShowAddUserModal(true);
                        setStep(1);
                    }}
                        className="w-full sm:w-auto flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            <Plus className="w-4 h-4"/>
                                Add User
                    </button>
                </div>

                {/*Main Card*/}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {/*Search+Filter*/}
                    <div className = "p-4 flex flex-col lg:flex-row justify-between gap-4 border-b border-gray-200">
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full lg:w-96">
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="outline-none w-full text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}/>
                        </div>

                        <select
                            value = {designation}
                            onChange = {(e) => setDesignation(e.target.value)}
                            className = "border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                <option>All Designations</option>
                                <option>Manager</option>
                                <option>Front Office Staff</option>
                                <option>Pharmacist</option>
                                <option>Nurse</option>
                                <option>Junior Doctor</option>
                                <option>Senior Doctor</option>
                            </select>
                    </div>

                    <div className = "overflow-x-auto">
                        <table className = "min-w-[900px] w-full text-sm">
                            <thead className = "bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className = "text-left px-4 py-3 text-gray-500">
                                        Name
                                    </th>
                                    <th className = "text-left px-4 py-3 text-gray-500">
                                        Designation
                                    </th>
                                    <th className = "text-left px-4 py-3 text-gray-500">
                                        Mobile
                                    </th>
                                    <th className = "text-left px-4 py-3 text-gray-500">
                                        Email
                                    </th>
                                    <th className = "text-left px-4 py-3 text-gray-500">
                                        Specialization
                                    </th>
                                    <th className = "text-left px-4 py-3 text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key = {user.id} className = "border-b border-gray-100 hover:bg-gray-50">
                                        <td className = "px-4 py-4">{user.name}</td>
                                        <td className = "px-4 py-4">{user.designation}</td>
                                        <td className = "px-4 py-4">{user.mobile}</td>
                                        <td className = "px-4 py-4">{user.email}</td>
                                        <td className = "px-4 py-4">{user.specialization}</td>
                                        <td className = "px-4 py-4">
                                            <div className = "flex items-center justify-center gap-2">
                                                <button className="text-gray-500 hover:text-blue-600"
                                                        onClick = {() => handleEdit(user)}>
                                                    <Pencil size={16} />
                                                </button>

                                                <button className="text-gray-500 hover:text-red-600"
                                                        onClick = {() => handleDelete(user.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan = {6}
                                            className = "text-center py-8 text-gray-400">
                                                No Users Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showAddUserModal && step ===1 && (
                <div className = "fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className = "bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className = "border-b px-6 py-4 flex justify-between items-center">
                            <h2 className ="text-xl font-semibold">
                                Add User
                            </h2>

                            <button
                                onClick={() => {
                                    setShowAddUserModal(false);
                                    setStep(1);
                                }}
                                className="text-gray-400 text-2xl">
                                    ×
                            </button>
                        </div>

                        <div className = "p-6">
                            <div className ="mb-5">
                                <label className="block text-sm font-medium mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={userData.fullName}
                                    onChange = {(e) =>
                                        setUserData({
                                            ...userData,
                                            fullName: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-lg px-4 py-3"/>
                            </div>
                            <div className = "grid md:grid-cols-2 gap-4 mb-5">
                                <div>
                                    <label className = "block text-sm font-medium mb-2">
                                        Date of Birth
                                    </label>
                                    <input 
                                        type="date"
                                        max={yesterday.toISOString().split("T")[0]}
                                        value ={userData.dob}
                                        onChange={(e) =>
                                            setUserData({
                                                ...userData,
                                                dob: e.target.value,
                                            })
                                        }
                                        className = "w-full border rounded-lg px-4 py-3"/>
                                </div>
                                <div>
                                    <label className = "block text-sm font-medium mb-2">
                                        Mobile
                                    </label>
                                    <input 
                                        type="text"
                                        value ={userData.mobile}
                                        onChange={(e) =>
                                            setUserData({
                                                ...userData,
                                                mobile: e.target.value,
                                            })
                                        }
                                        className = "w-full border rounded-lg px-4 py-3"/>
                                </div>
                            </div>
                            <div className = "grid md:grid-cols-2 gap-4 mb-5">
                                <div>
                                    <label className = "block text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <input 
                                        type="email"
                                        value ={userData.email}
                                        onChange={(e) =>
                                            setUserData({
                                                ...userData,
                                                email: e.target.value,
                                            })
                                        }
                                        className = "w-full border rounded-lg px-4 py-3"/>
                                </div>
                                <div>
                                    <label className = "block text-sm font-medium mb-2">
                                        Aadhaar Number
                                    </label>
                                    <input 
                                        type="text"
                                        value ={userData.aadhaar}
                                        onChange={(e) =>
                                            setUserData({
                                                ...userData,
                                                aadhaar: e.target.value,
                                            })
                                        }
                                        className = "w-full border rounded-lg px-4 py-3"/>
                                </div>
                            </div>
                            <div className = "grid md:grid-cols-3 gap-4 mb-5">
                                <div>
                                    <label className = "block text-sm font-medium mb-2">
                                        PAN Number
                                    </label>
                                    <input 
                                        type = "text"
                                        value = {userData.pan}
                                        onChange = {(e) =>
                                            setUserData({
                                                ...userData,
                                                pan:e.target.value
                                            })
                                        }
                                        className = "w-full border rounded-lg px-4 py-3"/>
                                </div>
                                <div>
                                    <label className = "block text-sm font-medium mb-2">
                                        Gender
                                    </label>
                                    <select
                                        value = {userData.gender}
                                        onChange = {(e) =>
                                            setUserData({
                                                ...userData,
                                                gender:e.target.value
                                            })
                                        }
                                        className = "w-full border rounded-lg px-4 py-3">
                                            <option value="">Select Gender</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className = "block text-sm font-medium mb-2">
                                        Designation
                                    </label>
                                    <select
                                        value = {userData.designation}
                                        onChange = {(e) =>
                                            setUserData({
                                                ...userData,
                                                designation:e.target.value
                                            })
                                        }
                                        className = "w-full border rounded-lg px-4 py-3">
                                            <option>Manager</option>
                                            <option>Front Office Staff</option>
                                            <option>Pharmacist</option>
                                            <option>Nurse</option>
                                            <option>Junior Doctor</option>
                                            <option>Senior Doctor</option>
                                    </select>
                                </div>
                            </div>
                            <div className = "mb-6">
                                    <label className = "block text-sm font-medium mb-2">
                                        Postal Address
                                    </label>
                                    <textarea 
                                        rows = {4}
                                        value = {userData.address}
                                        onChange = {(e) =>
                                            setUserData({
                                                ...userData,
                                                address:e.target.value
                                            })
                                        }
                                        className = "w-full border rounded-lg px-4 py-3"/>
                            </div>

                            <div className = "flex justify-end gap-3 border-t pt-5">
                                <button
                                    onClick={() => {
                                    setShowAddUserModal(false);
                                    setStep(1);
                                    }}
                                    className="px-6 py-2 border rounded-lg">
                                        Cancel
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                                        Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAddUserModal && step ===2 && (
                <div className = "fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className = "bg-white rounded-xl w-full max-w-lg">
                        <div className = "border-b px-6 py-4 flex justify-between items-center">
                            <h2 className = "text-xl font-semibold">
                                Login Credentials
                            </h2>

                            <button
                                onClick={() => {
                                setShowAddUserModal(false);
                                setStep(1);
                                }}
                                className="text-gray-400 text-2xl">
                                    ×
                            </button>
                        </div>
                        <div className ="p-6">
                            {/*Username*/}
                            <div className = "mb-5">
                                <label className = "block text-sm font-medium mb-2">
                                    Username
                                </label>

                                <input 
                                    type="text"
                                    value={userData.username}
                                    onChange = {(e) =>
                                    setUserData({
                                        ...userData,
                                        username: e.target.value,
                                    })
                                    }
                                    className="w-full border rounded-lg px-4 py-3"
                                    placeholder = "Enter username"/>
                            </div>

                            {/*password*/}
                            <div className = "mb-5">
                                <label className = "block text-sm font-medium mb-2">
                                    Password
                                </label>
                                <input 
                                    type="password"
                                    value={userData.password}
                                    onChange = {(e) =>
                                    setUserData({
                                        ...userData,
                                        password: e.target.value,
                                    })
                                    }
                                    className="w-full border rounded-lg px-4 py-3"
                                    placeholder = "Enter password"/>
                            </div>
                            <div className = "mb-6">
                                <label className = "block text-sm font-medium mb-2">
                                     Confirm Password
                                </label>
                                <input 
                                    type="password"
                                    value={userData.confirmPassword}
                                    onChange = {(e) =>
                                    setUserData({
                                        ...userData,
                                        confirmPassword: e.target.value,
                                     })
                                    }
                                    className="w-full border rounded-lg px-4 py-3"
                                    placeholder = "Re-enter password"/>
                            </div>

                            <div className = "flex justify-end gap-3 border-t pt-5">
                                <button onClick = {() => setStep(1)}
                                    className = "px-6 py-2 border rounded-lg">
                                        Back
                                </button>
                                <button onClick = {handleSaveUser}
                                    className = "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Save User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && editData && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

                        {/* Header */}
                        <div className="border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                Edit User
                            </h2>

                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 text-2xl">
                                    ×
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 sm:p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-lg px-4 py-3"/>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Mobile
                                    </label>

                                    <input
                                        type="text"
                                        value={editData.mobile}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                mobile: e.target.value,
                                            })
                                        }
                                        className="w-full border rounded-lg px-4 py-3"/>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            email: e.target.value,
                                        })
                                        }
                                    className="w-full border rounded-lg px-4 py-3"/>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Date of Birth
                                        </label>

                                        <input
                                            type="date"
                                            value={editData.dob || ""}
                                            onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                dob: e.target.value,
                                            })
                                        }
                                        className="w-full border rounded-lg px-4 py-3"/>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Aadhaar Number
                                        </label>

                                        <input
                                            type="text"
                                            value={editData.aadhaar || ""}
                                            onChange={(e) =>
                                                setEditData({
                                                ...editData,
                                                aadhaar: e.target.value,
                                            })
                                            }
                                            className="w-full border rounded-lg px-4 py-3"/>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            PAN Number
                                        </label>

                                        <input
                                            type="text"
                                            value={editData.pan || ""}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    pan: e.target.value,
                                                })
                                            }
                                            className="w-full border rounded-lg px-4 py-3"/>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Gender
                                        </label>

                                        <select
                                            value={editData.gender || ""}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    gender: e.target.value,
                                                    })
                                                }
                                            className="w-full border rounded-lg px-4 py-3">
                                            <option value="">Select Gender</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                </div>


                                </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">
                                            Designation
                                        </label>

                                        <select
                                            value={editData.designation}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    designation: e.target.value,
                                                })
                                            }
                                            className="w-full border rounded-lg px-4 py-3">
                                            <option>Manager</option>
                                            <option>Front Office Staff</option>
                                            <option>Pharmacist</option>
                                            <option>Nurse</option>
                                            <option>Junior Doctor</option>
                                            <option>Senior Doctor</option>
                                        </select>
                                    </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-2">
                                                Specialization
                                            </label>

                                            <input
                                                type="text"
                                                value={editData.specialization || ""}
                                                onChange={(e) =>
                                                setEditData({
                                                ...editData,
                                                specialization: e.target.value,
                                                })
                                                }
                                                className="w-full border rounded-lg px-4 py-3"/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-2">
                                                Postal Address
                                            </label>

                                            <textarea
                                                rows={4}
                                                value={editData.address || ""}
                                                onChange={(e) =>
                                                    setEditData({
                                                        ...editData,
                                                        address: e.target.value,
                                                    })
                                                }
                                                className="w-full border rounded-lg px-4 py-3"/>
                                        </div>

                                        <div className="flex justify-end gap-3 border-t pt-5">
                                            <button
                                                onClick={() => setShowEditModal(false)}
                                                className="px-6 py-2 border rounded-lg">
                                                    Cancel
                                            </button>

                                            <button
                                                onClick={handleUpdateUser}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                                                    Save Changes
                                            </button>
                                        </div>

                                </div>
                            </div>
                        </div>
                
            )}
        </Layout>
    );
}
