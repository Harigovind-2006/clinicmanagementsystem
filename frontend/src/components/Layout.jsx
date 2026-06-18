import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Layout({
  children,
  sidebarOpen = false,
  setSidebarOpen = () => {},
}) {
  const navigate = useNavigate();

  const role =
    localStorage.getItem("role") || "";

  console.log("ROLE =", role);

  let menuItems = [];

  switch (role) {
    case "manager":
      menuItems = [
        {
          name: "Dashboard",
          path: "/dashboard",
        },
        {
          name: "Patients",
          path: "/patients",
        },
        {
          name: "Admissions",
          path: "/admission",
        },
        {
          name: "Bills & Payments",
          path: "/bill-payments",
        },
        {
          name: "Medicines",
          path: "/medicine-inventory",
        },
        {
          name: "Users",
          path: "/users",
        },
      ];
      break;

    case "frontoffice":
      menuItems = [
        {
          name: "Dashboard",
          path: "/admission",
        },
        {
          name: "Patients",
          path: "/patients",
        },
        {
          name: "Admissions",
          path: "/admission",
        },
        {
          name: "Bills & Payments",
          path: "/bill-payments",
        },
      ];
      break;

    case "seniordoctor":
      menuItems = [
        {
          name: "Dashboard",
          path: "/senior-doctor",
        },
      ];
      break;

    case "juniordoctor":
      menuItems = [
        {
          name: "Dashboard",
          path: "/junior-doctor",
        },
      ];
      break;

    case "nurse":
      menuItems = [
        {
          name: "Patients",
          path: "/nurse",
        },
      ];
      break;

    case "pharmacist":
      menuItems = [
        {
          name: "Patient Medicines",
          path: "/pharmacist",
        },
        {
          name: "Medicines",
          path: "/medicine-inventory",
        },
      ];
      break;

    default:
      menuItems = [
        {
          name: "Dashboard",
          path: "/",
        },
      ];
  }

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
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
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              CMS
            </h1>

            <p className="text-sm text-gray-500 capitalize">
              {role || "Guest"}
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
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
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