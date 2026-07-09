import { useEffect, useState } from "react";
import { API_ERRORS } from "@/constants/ui-text/shared/api";
import type { User } from "@/types/user";

export function useUser() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch("/api/users");

                if (!res.ok) {
                    throw new Error(API_ERRORS.USER_LOAD_FAILED);
                }

                const data: User[] = await res.json();
                setUsers(data);
            } catch (err: any) {
                setError(err.message || API_ERRORS.UNKNOWN_ERROR);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading, error };
}
