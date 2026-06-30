import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ name, setName, className = "" }) {
  return (
    <div
      className={`flex items-center gap-3 w-full bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 ${className}`}
    >
      <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <input
        placeholder="Search by name, PID, doctor..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-transparent outline-none text-sm text-gray-700"
      />
    </div>
  );
}