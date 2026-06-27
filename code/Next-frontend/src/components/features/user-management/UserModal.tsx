"use client";

import { useState } from "react";

export default function UserModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "customer",
    lastlogin: "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white w-[500px] rounded-xl p-6 space-y-4">

        {/* Header */}
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Create User</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <input
          className="border w-full p-2 rounded"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="border w-full p-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <select
        aria-label="Status filter"
          className="border w-full p-2 rounded"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="customer">Customer</option>
          <option value="librarian">Librarian</option>
          <option value="admin">Admin</option>
        </select>

        <input
          className="border w-full p-2 rounded"
          placeholder="Last Login"
          value={form.lastlogin}
          onChange={(e) =>
            setForm({ ...form, lastlogin: e.target.value })
          }
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            Create
          </button>

        </div>

      </div>
    </div>
  );
}