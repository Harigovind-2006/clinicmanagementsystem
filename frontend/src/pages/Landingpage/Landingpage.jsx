import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SplitText from "./SplitText";

const handleAnimationComplete = () => {
  console.log("Animation Complete");
};

export default function Landingpage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login Failed");
        return;
      }

      localStorage.setItem("token", data.token);

      const payload = JSON.parse(
        atob(data.token.split(".")[1])
      );

      localStorage.setItem("role", payload.role);
      localStorage.setItem("userId", payload.userId);
      localStorage.setItem("username", payload.username);

      switch (payload.role) {
        case "manager":
          navigate("/dashboard");
          break;

        case "fos":
        case "receptionist":
          navigate("/admission");
          break;

        case "seniordoctor":
          navigate("/senior-doctor");
          break;

        case "juniordoctor":
          navigate("/junior-doctor");
          break;

        case "nurse":
          navigate("/nurse");
          break;

        case "pharmacist":
          navigate("/pharmacist");
          break;

        case "labtechnician":
          navigate("/lab-technician");
          break;

        default:
          navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
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
              required
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
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}

