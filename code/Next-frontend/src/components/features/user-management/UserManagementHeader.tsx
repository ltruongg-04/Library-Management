"use client";

export default function UserManagementHeader({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-gray-500">
          Manage library access, roles, and user accounts.
        </p>
      </div>

      <button
        onClick={onCreate}
        className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
      >
        + Create User
      </button>
    </div>
  );
}