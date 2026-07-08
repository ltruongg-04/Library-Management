"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import BookVisitFilters from "@/components/features/admin/book-visits/BookVisitFilters";
import BookVisitManagementHeader from "@/components/features/admin/book-visits/BookVisitManagementHeader";
import BookVisitTable from "@/components/features/admin/book-visits/BookVisitTable";
import { ADMIN_BOOK_VISITS } from "@/constants/ui-text/admin";
import axiosInstance from "@/lib/axios";

export default function BookVisitsPage() {
    const [visits, setVisits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const fetchVisits = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/api/admin/book-visits?page=0&size=20&sort=createdAt,desc");
            setVisits(res.data.content);
        } catch (error) {
            toast.error(ADMIN_BOOK_VISITS.MESSAGES.FETCH_ERROR);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await axiosInstance.put(`/api/admin/book-visits/${id}/status`, { status, notes: ADMIN_BOOK_VISITS.MESSAGES.ADMIN_NOTE });
            toast.success(ADMIN_BOOK_VISITS.MESSAGES.UPDATE_SUCCESS);
            fetchVisits();
        } catch (error) {
            toast.error(ADMIN_BOOK_VISITS.MESSAGES.UPDATE_ERROR);
        }
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setStatusFilter("");
    };

    // Filter logic
    const filteredVisits = visits.filter((visit) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            visit.fullName.toLowerCase().includes(searchLower) || visit.email.toLowerCase().includes(searchLower) || visit.id.toString().includes(searchQuery);

        const matchesStatus = statusFilter === "" || visit.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex h-full flex-col gap-6 bg-surface p-6 dark:bg-zinc-950 md:p-8">
            <AdminBreadcrumb pageName={ADMIN_BOOK_VISITS.BREADCRUMB.VISITS} />

            <BookVisitManagementHeader />

            <BookVisitFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onClearFilters={handleClearFilters}
            />

            <BookVisitTable visits={filteredVisits} loading={loading} onUpdateStatus={handleUpdateStatus} />
        </div>
    );
}
