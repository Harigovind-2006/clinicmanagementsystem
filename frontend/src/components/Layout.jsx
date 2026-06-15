import React, { Children } from "react";
import { NavLink } from "react-router-dom";

const role='Nurse'
export default function Layout() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Patients", path: "/patients" },
    { name: "Admissions", path: "/admissions" },
    { name: "Bills & Payments", path: "/billing" },
    { name: "Medicines", path: "/medicines" },
    { name: "Users", path: "/users" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-gray-200">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>

            <h1 className="ml-3 text-xl font-semibold text-gray-900">
            CMS
            </h1>
        </div>

        <nav className="flex-1 p-3">
            <ul className="space-y-2">
            {menuItems.map((item) => (
                <li key={item.path}>
                <NavLink
                    to={item.path}
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

        <div className="p-4 border-t border-gray-200">
            <button className="w-full text-left text-red-500 font-medium hover:text-red-600">
            Logout
            </button>
        </div>

        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
                <h2 className="text-gray-900 text-base" style={{ fontWeight: 600 }}>{role}</h2>
                <div className="p-4 border-t border-gray-200">
                    <button className="w-full text-left text-red-500 font-medium hover:text-red-600">
                    Logout
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    </div>
  );
}