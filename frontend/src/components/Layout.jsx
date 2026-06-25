import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Layout({
  children,
  sidebarOpen = false,
  setSidebarOpen = () => {},
}) {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log("Stored userId:", userId);

        // FIX 1: Catch both null/missing AND literal "undefined" strings
        if (!userId || userId === "undefined") {
          console.warn("Valid userId not found, redirecting to login...");
          navigate("/");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/userapi/userget/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user role from database");
        }

        const data = await response.json();

        // Assuming your database schema stores the role as 'role'
        setRole(data.role);
        console.log("ROLE fetched from DB =", data.role);
      } catch (error) {
        console.error(error);
        // Optional: Force logout if the DB fetch fails (e.g., deleted user)
        // navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [navigate]);

  let menuItems = [];

  // FIX 2: Safeguard against case-sensitivity or undefined roles causing crashes
  // Converting to lowercase and adding a fallback safely handles unexpected formats
  const normalizedRole = (role || "").toLowerCase().trim();

  switch (normalizedRole) {
    case "manager":
      menuItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Patients", path: "/patients" },
        { name: "Admissions", path: "/admission" },
        { name: "Bills & Payments", path: "/bill-payments" },
        { name: "Medicines", path: "/medicine-inventory" },
        { name: "Procedures", path: "/procedure-inventory" },
        { name: "Users", path: "/users" },
      ];
      break;

    case "fos":
      menuItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Patients", path: "/patients" },
        { name: "Admissions", path: "/admission" },
        { name: "Bills & Payments", path: "/bill-payments" },
      ];
      break;

    case "seniordoctor":
      menuItems = [{ name: "Dashboard", path: "/senior-doctor" }];
      break;

    case "juniordoctor":
      menuItems = [{ name: "Dashboard", path: "/junior-doctor" }];
      break;

    case "nurse":
      menuItems = [{ name: "Patients", path: "/nurse" }];
      break;

    case "pharmacist":
      menuItems = [
        { name: "Patient Medicines", path: "/pharmacist" },
        { name: "Medicines", path: "/medicine-inventory" },
      ];
      break;

    default:
      menuItems = [{ name: "Dashboard", path: "/" }];
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-50
          flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">CMS</h1>
            <p className="text-sm text-gray-500 capitalize">
              {isLoading ? "Loading..." : role || "Guest"}
            </p>
          </div>

          <button
            className="lg:hidden text-xl"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {isLoading ? (
            <div className="animate-pulse space-y-4 pt-2">
              <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
              <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
              <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
            </div>
          ) : (
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl transition ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-300">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        <main>{children}</main>
      </div>
    </div>
  );
}