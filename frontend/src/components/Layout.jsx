import React from "react";
import { NavLink } from "react-router-dom";

export default function Layout({
  sidebarOpen,
  setSidebarOpen,
}) {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Patients", path: "/patients" },
    { name: "Admissions", path: "/admissions" },
    { name: "Bills & Payments", path: "/billing" },
    { name: "Medicines", path: "/medicines" },
    { name: "Users", path: "/users" },
  ];

  return (
    <>
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
          fixed top-0 left-0 h-screen w-64 bg-white z-50
          flex flex-col
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>

            <h1 className="ml-3 text-xl font-semibold text-gray-900">
              CMS
            </h1>
          </div>

          <button
            className="lg:hidden text-2xl"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-2">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
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

        {/* Logout at Bottom */}
        <div className="p-4">
          <button className="w-full text-left px-4 py-3 rounded-lg text-red-500 font-medium hover:bg-red-50">
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}