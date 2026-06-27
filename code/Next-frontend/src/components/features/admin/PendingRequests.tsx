"use client";

import { useState } from "react";
import { UI_TEXT } from "@/constants/ui-text";

const { PENDING_REQUESTS } = UI_TEXT.ADMIN;

interface Request {
    id: string;
    user: string;
    initials: string;
    avatarTone: string;
    title: string;
    matchScore: number;
}

const REQUESTS: Request[] = [
    {
        id: "r1",
        user: "Elena K.",
        initials: "EK",
        avatarTone: "bg-[#5B4FE5]",
        title: "The Design of Everyday Things",
        matchScore: 98,
    },
    {
        id: "r2",
        user: "Marcus R.",
        initials: "MR",
        avatarTone: "bg-[#8B3FA0]",
        title: "Advanced Data Structures",
        matchScore: 85,
    },
    {
        id: "r3",
        user: "Sarah J.",
        initials: "SJ",
        avatarTone: "bg-[#1E8A6E]",
        title: "Neuromancer",
        matchScore: 72,
    },
];

function MatchBadge({ score }: { score: number }) {
    const tone = score >= 90 ? "bg-moss-50 text-moss-600" : score >= 75 ? "bg-brass-500/10 text-brass-600" : "bg-ink-950/5 text-ink-950/50";

    return (
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[12px] font-semibold ${tone}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {score}%
        </span>
    );
}

export default function PendingRequests() {
    const [requests, setRequests] = useState(REQUESTS);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const handleAction = (id: string) => {
        setRemovingId(id);
        setTimeout(() => {
            setRequests((prev) => prev.filter((r) => r.id !== id));
            setRemovingId(null);
        }, 220);
    };

    return (
        <div className="shadow-card rounded-xl border border-ink-950/[0.06] bg-white">
            <div className="flex items-center justify-between border-b border-ink-950/[0.06] px-5 py-4">
                <h2 className="text-[17px] font-semibold text-ink-950">{PENDING_REQUESTS.TITLE}</h2>
                <button className="focus-ring rounded-md px-2 py-1 text-[13px] font-medium text-brass-600 hover:bg-brass-500/10">
                    {PENDING_REQUESTS.VIEW_ALL}
                </button>
            </div>

            {requests.length === 0 ? (
                <div className="px-5 py-12 text-center">
                    <p className="text-[14px] text-ink-950/45">{PENDING_REQUESTS.EMPTY_STATE}</p>
                </div>
            ) : (
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-ink-950/[0.06] text-left">
                            <th className="px-5 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-950/40">{PENDING_REQUESTS.TABLE_MEMBER}</th>
                            <th className="px-3 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-950/40">
                                {PENDING_REQUESTS.TABLE_BOOK_TITLE}
                            </th>
                            <th className="px-3 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-950/40">{PENDING_REQUESTS.TABLE_MATCH}</th>
                            <th className="px-5 py-2.5 text-right text-[11.5px] font-semibold uppercase tracking-wide text-ink-950/40">
                                {PENDING_REQUESTS.TABLE_ACTIONS}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr
                                key={req.id}
                                className={`border-b border-ink-950/[0.04] transition-opacity duration-200 last:border-0 ${
                                    removingId === req.id ? "opacity-0" : "opacity-100"
                                }`}
                            >
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11.5px] font-semibold text-white ${req.avatarTone}`}
                                        >
                                            {req.initials}
                                        </span>
                                        <span className="text-[14px] font-medium text-ink-950">{req.user}</span>
                                    </div>
                                </td>
                                <td className="px-3 py-3.5">
                                    <span className="text-[14px] text-ink-950/75">{req.title}</span>
                                </td>
                                <td className="px-3 py-3.5">
                                    <MatchBadge score={req.matchScore} />
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleAction(req.id)}
                                            className="focus-ring rounded-md border border-ink-950/10 px-3 py-1.5 text-[13px] font-medium text-ink-950/60 transition-colors hover:bg-ink-950/[0.04] hover:text-ink-950"
                                        >
                                            {PENDING_REQUESTS.BTN_REJECT}
                                        </button>
                                        <button
                                            onClick={() => handleAction(req.id)}
                                            className="focus-ring rounded-md bg-ink-950 px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-ink-900"
                                        >
                                            {PENDING_REQUESTS.BTN_APPROVE}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
