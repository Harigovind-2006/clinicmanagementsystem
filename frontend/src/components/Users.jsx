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
    },
    {
        id: 2,
        name: "Dr. Priya Verma",
        designation: "Senior Doctor",
        mobile: "9822345678",
        email: "priya@clinic.com",
        specialization: "General Medicine",
    },
    {
        id: 3,
        name: "Dr. Rahul Kumar",
        designation: "Junior Doctor",
        mobile: "9833456789",
        email: "rahul@clinic.com",
        specialization: "-",
    },
    {
        id: 4,
        name: "Dr. Neha Singh",
        designation: "Junior Doctor",
        mobile: "9844567890",
        email: "neha@clinic.com",
        specialization: "-",
    },
    {
        id: 5,
        name: "Sunita Devi",
        designation: "Nurse",
        mobile: "9855678901",
        email: "sunita@clinic.com",
        specialization: "-",
    },
    {
        id: 6,
        name: "Kavita Rao",
        designation: "Nurse",
        mobile: "9866789012",
        email: "kavita@clinic.com",
        specialization: "-",
    },
];

export default function Users(){
    const [search, setSearch] = useState("");
    const [designation, setDesignation] = useState("All Designations");
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [step, setStep] = useState(1);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
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

    const filteredUsers = usersData.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                            user.email.toLowerCase().includes(search.toLowerCase());

        const matchesDesignation = 
                designation ==="All Designations" ||
                user.designation === designation;

        return matchesSearch && matchesDesignation;
    });

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

        alert("User Added Successfully");

        setShowAddUserModal(false);
        setStep(1);
    };

    return (
        <Layout>
            <div className = "space-y-6">
                {/*Header*/}
                <div className = "flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Users
                    </h1>

                    <button onClick = {() => {
                        setShowAddUserModal(true);
                        setStep(1);
                    }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            <Plus className="w-4 h-4"/>
                                Add User
                    </button>
                </div>

                {/*Main Card*/}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {/*Search+Filter*/}
                    <div className = "p-4 flex flex-col md:flex-row justify-between gap-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-full md:w-96">
                            <Search className="w-4 h-4 text-gray-400" />

                            <input 
                                type = "text"
                                placeholder = "Search by name or email...."
                                className = "outline-none w-full text-sm"
                                value = {search}
                                onChange = {(e) => setSearch(e.target.value)}
                            />
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
                        <table className = "w-full text-sm">
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
                                            <div className = "flex justify-center gap-3">
                                                <button className="text-gray-500 hover:text-blue-600">
                                                    <Pencil className="w-4 h-4" />
                                                </button>

                                                <button className="text-gray-500 hover:text-red-600">
                                                    <Trash2 className="w-4 h-4" />
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
                    <div className = "bg-white rounded-xl w-full max-w-4xl">
                        <div className = "border-b px-6 py-4 flex justify-between items-center">
                            <h2 className ="text-xl font-semibold">
                                Add User
                            </h2>

                            <button onClick ={() => setShowAddUserModal(false)}
                                    className = "text-gray-400 text-2xl">
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
                                        rows = "4"
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
                                <button onClick = {() =>
                                        setShowAddUserModal(false)}
                                        className = "px-6 py-2 border rounded-lg">
                                            Cancel
                                </button>
                                <button onClick ={() => setStep(2)}
                                        className = "px-6 py-2 bg-blue-600 text-white rounded-lg">
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
                                Loign Credentials
                            </h2>

                            <button onClick = {() =>
                                setShowAddUserModal(false)}
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
        </Layout>
    );
}