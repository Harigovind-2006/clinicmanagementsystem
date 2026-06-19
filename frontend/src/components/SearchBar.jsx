import React from "react";

export default function SearchBar({ name, setName }) {
  return (
    <input
      type="text"
      placeholder="Search by PID or Patient Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-80 px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}