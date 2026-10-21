"use client";

import { useEffect, useState } from "react";
import { Globe, LogOut, Monitor, ShieldAlert, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { UI_TEXT } from "@/constants/ui-text";
import { formatDate } from "@/lib/utils";
import { AdminSession, getAllSessions, terminateAllUserSessions, terminateSession } from "@/services/adminSession";

export default function SessionManagement() {
    const [sessions, setSessions] = useState<AdminSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            const res = await getAllSessions();
            if (res.success && res.data) {
                setSessions(res.data);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_167);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTerminate = async (sessionId: string) => {
        if (!confirm(UI_TEXT.RECENT.TEXT_166)) return;

        try {
            const res = await terminateSession(sessionId);
            if (res.success) {
                toast.success(UI_TEXT.RECENT.TEXT_165);
                fetchSessions();
            } else {
                toast.error(res.message || UI_TEXT.RECENT.TEXT_164);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_163);
        }
    };

    const handleTerminateAll = async (userId: number) => {
        if (!confirm(UI_TEXT.RECENT.TEXT_162)) return;

        try {
            const res = await terminateAllUserSessions(userId);
            if (res.success) {
                toast.success(UI_TEXT.RECENT.TEXT_161);
                fetchSessions();
            } else {
                toast.error(res.message || UI_TEXT.RECENT.TEXT_160);
            }
        } catch (error) {
            toast.error(UI_TEXT.RECENT.TEXT_159);
        }
    };

    const getDeviceIcon = (userAgent: string) => {
        const ua = userAgent.toLowerCase();
        if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) return <Smartphone size={20} className="text-primary" />;
        return <Monitor size={20} className="text-primary" />;
    };

    const getBrowserInfo = (userAgent: string) => {
        const ua = userAgent.toLowerCase();
        if (ua.includes("chrome")) return "Chrome";
        if (ua.includes("firefox")) return "Firefox";
        if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
        if (ua.includes("edge")) return "Edge";
        return "Unknown Browser";
    };

    const filteredSessions = sessions.filter(
        (s) =>
            s.username?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            s.fullName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            s.ipAddress?.includes(searchKeyword),
    );

    return (
        <div className="flex h-full flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-on-surface">{UI_TEXT.RECENT.TEXT_158}</h1>
                    <p className="text-sm text-on-surface-variant">{UI_TEXT.RECENT.TEXT_157}</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Tìm email, tên, IP..."
                        className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 overflow-y-auto pb-12 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <div className="col-span-full rounded-xl border border-outline-variant/30 bg-surface py-12 text-center text-on-surface-variant dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        <ShieldAlert size={48} className="mx-auto mb-4 opacity-50" />
                        <p>{UI_TEXT.RECENT.TEXT_156}</p>
                    </div>
                ) : (
                    filteredSessions.map((session) => (
                        <div
                            key={session.id}
                            className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="bg-success absolute right-0 top-0 h-1 w-full"></div>

                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                                        {getDeviceIcon(session.userAgent)}
                                    </div>
                                    <div>
                                        <h3 className="line-clamp-1 font-semibold text-on-surface dark:text-white">{session.fullName || session.username}</h3>
                                        <p className="text-xs text-on-surface-variant dark:text-slate-400">{session.username}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleTerminateAll(session.userId)}
                                    className="rounded bg-error/10 px-2 py-1 text-[10px] font-medium text-error transition-colors hover:bg-error hover:text-white"
                                    title="Đăng xuất khỏi tất cả thiết bị"
                                >
                                    {UI_TEXT.RECENT.TEXT_155}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400">
                                    <Globe size={14} /> <span>IP: {session.ipAddress === "0:0:0:0:0:0:0:1" ? "127.0.0.1" : session.ipAddress}</span>
                                </div>
                                <div className="text-right text-on-surface-variant dark:text-slate-400">{getBrowserInfo(session.userAgent)}</div>
                                <div className="col-span-2 mt-1 text-xs text-on-surface-variant dark:text-slate-400">
                                    {UI_TEXT.RECENT.TEXT_154}
                                    {session.loginTime ? formatDate(session.loginTime) : UI_TEXT.RECENT.TEXT_153}
                                </div>
                            </div>

                            <button
                                onClick={() => handleTerminate(session.id)}
                                className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-surface-variant py-2 text-sm font-medium text-error transition-colors hover:border-error/20 hover:bg-error/10 dark:bg-slate-800 dark:hover:bg-error/20"
                            >
                                <LogOut size={16} /> {UI_TEXT.RECENT.TEXT_152}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
