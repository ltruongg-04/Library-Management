"use client";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "librarian" | "customer";
  status: "active" | "locked" | "inactive";
  lastLogin: string;
};

export default function UserTable({
  users,
}: {
  users: User[];
}) {
  const statusStyle = {
    active: "text-green-600",
    locked: "text-red-600",
    inactive: "text-gray-500",
  };

  return (
    <div className="border rounded-lg overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th className="text-right p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="border-t hover:bg-gray-50 transition"
            >

              <td className="p-3 font-medium">{u.name}</td>
              <td>{u.email}</td>
              <td className="capitalize">{u.role}</td>

              <td className={statusStyle[u.status]}>
                {u.status}
              </td>
              <td>{u.lastLogin}</td>

              <td className="text-right p-3 space-x-2">

                <button className="text-blue-600 hover:underline">
                  Edit
                </button>

                <button className="text-red-600 hover:underline">
                  {u.status === "locked" ? "Unlock" : "Lock"}
                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}