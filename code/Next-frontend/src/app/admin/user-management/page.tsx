"use client";

import { useState } from "react";

import UserManagementHeader from "@/components/features/user-management/UserManagementHeader";
import UserFilters from "@/components/features/user-management/UserFilters";
import UserTable from "@/components/features/user-management/UserTable";
import UserModal from "@/components/features/user-management/UserModal";
import type { User } from "@/types/user";
//import { useUser } from "@/hooks/useUsers";

export default function UserManagementPage() {
  const [open, setOpen] = useState(false);
  //const { users, loading, error } = useUser();
  
  const users: User[] = [
      {
        id: 1,
        name: "Eleanor Vance",
        email: "eleanor.v@lumina.edu",
        role: "admin",
        status: "active",
        lastLogin: "2 mins ago",
      },
      {
        id: 2,
        name: "Marcus Lee",
        email: "m.lee@lumina.edu",
        role: "librarian",
        status: "active",
        lastLogin: "3 hours ago",
      },
      {
        id: 3,
        name: "Sarah Jenkins",
        email: "s.jenkins@mail.com",
        role: "customer",
        status: "locked",
        lastLogin: "Oct 12, 2023",
      },
    ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <UserManagementHeader
        onCreate={() => setOpen(true)}
      />
      {/* Card */}
      <div className="border rounded-lg overflow-hidden">
        <div className="p-6">
          <UserFilters />
        </div>
      </div>
        <div className="p-6">
          <UserTable users={users} />
        </div>
        {/* <div className="border-t">
          {loading && (
            <div className="p-6 text-gray-500">
              Loading users...
            </div>
          )}

          {error && (
            <div className="p-6 text-red-500">
              {error}
            </div>
          )}

          {!loading && !error && (
            <UserTable users={users} />
          )}
        </div>
      </div> */}
        
      <UserModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
