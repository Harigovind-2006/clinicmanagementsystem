import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SplitText from "./SplitText";
import { loginUser } from "../../services/authService";

const handleAnimationComplete = () => {
  console.log("Animation Complete");
};

export default function Landingpage() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const roleCredentials = {
    manager: {
      username: "manager",
      password: "manager123",
      route: "/dashboard",
    },

    frontoffice: {
      username: "frontoffice",
      password: "fo123",
      route: "/admission",
    },

    seniordoctor: {
      username: "seniordoctor",
      password: "sd123",
      route: "/senior-doctor",
    },

    juniordoctor: {
      username: "juniordoctor",
      password: "jd123",
      route: "/junior-doctor",
    },

    nurse: {
      username: "nurse",
      password: "nurse123",
      route: "/nurse",
    },

    pharmacist: {
      username: "pharmacist",
      password: "pharma123",
      route: "/pharmacist",
    },
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;

    setSelectedRole(role);

    if (roleCredentials[role]) {
      setFormData({
        username: roleCredentials[role].username,
        password: roleCredentials[role].password,
      });
    } else {
      setFormData({
        username: "",
        password: "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    const role = roleCredentials[selectedRole];

    if (
      formData.username === role.username &&
      formData.password === role.password
    ) {
      setError("");

      // SAVE ROLE FOR LAYOUT
      localStorage.setItem("role", selectedRole);

      navigate(role.route);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <section className="h-screen w-full flex items-center justify-end pr-8 lg:pr-24 bg-[url('/loginbg.png')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-[500px] bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shadow-md">
            <span className="text-4xl text-blue-600">+</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <SplitText
            text="Welcome Back!"
            className="text-4xl font-bold text-slate-900"
            delay={40}
            duration={0.5}
            ease="power3.out"
            splitType="chars"
            from={{
              opacity: 0,
              y: 30,
            }}
            to={{
              opacity: 1,
              y: 0,
            }}
            threshold={0.1}
            rootMargin="-100px"
            onLetterAnimationComplete={handleAnimationComplete}
            showCallback
          />

          <SplitText
            text="Sign in to continue to Clinic Management System"
            className="text-gray-500 mt-3"
            delay={15}
            duration={0.3}
            ease="power3.out"
            splitType="words"
            from={{
              opacity: 0,
              y: 10,
            }}
            to={{
              opacity: 1,
              y: 0,
            }}
          />
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block mb-2 font-semibold text-slate-700">
              Role
            </label>

            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select Role</option>

              <option value="manager">Manager</option>

              <option value="frontoffice">Front Office</option>

              <option value="seniordoctor">Senior Doctor</option>

              <option value="juniordoctor">Junior Doctor</option>

              <option value="nurse">Nurse</option>

              <option value="pharmacist">Pharmacist</option>
            </select>
          </div>

          {/* Username */}
          <div>
            <label className="block mb-2 font-semibold text-slate-700">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Demo Credentials */}
      </div>
    </section>
  );
}


const handleLogin = async () => {
  try {
    const data = await loginUser({
      username,
      password,
    });

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "role",
       data.role
    );
    
    localStorage.setItem(
      "name",
      data.name
    );

    switch (data.role) {
      case "manager" :
        navigate("/dashboard");
        break;

      case "frontofficestaff":
        navigate("/dashboard");
        break;

      case "seniordoctor":
        navigate("/seniorDoctor");
        break;

      case "juniordoctor":
        navigate("/juniorDoctor");
        break;

      case "nurse":
        navigate("/nurse");
        break;

      case "pharmacist":
        navigate("/Pharmacist");
        break;

      default:
        navigate("/");
    }
  } catch (error) {
    alert (
      error.response?.data?.message || "Login Failed"
    );
  }
};