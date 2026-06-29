"use client";

import { useState } from "react";

export default function UserFilters() {
  const [search, setSearch] = useState("");

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex gap-3 flex-wrap items-center">

      {/* SEARCH */}
      <input
        className="border px-3 py-2 rounded w-80"
        placeholder="Search by name, email, or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ROLE FILTER */}
      <select
      aria-label="Status filter"
      className="border px-3 py-2 rounded">
        <option>All Roles</option>
        <option>Admin</option>
        <option>Librarian</option>
        <option>Customer</option>
      </select>

      {/* STATUS FILTER */}
      <select 
      aria-label="Status filter"
      className="border px-3 py-2 rounded">
        <option>All Status</option>
        <option>Active</option>
        <option>Locked</option>
        <option>Inactive</option>
      </select>

      {/* RELOAD */}
      <button
        onClick={handleReload}
        className="px-3 py-2 rounded-md border hover:bg-gray-100"
      >
        🔄 Reload
      </button>

    </div>
  );
}