import type { ElementType } from "react";

export type AuditResult = "success" | "failed" | "blocked";
export type TimeRangeFilter = "12h" | "1d" | "3d" | "7d" | "all";
export type ActorFilter = "all" | "user" | "admin" | "automation";
export type ExportFormat = "csv" | "json";

export type AuditLog = {
    id: string;
    timestamp: string;
    occurredAt: Date;
    actor: string;
    actorFilter: Exclude<ActorFilter, "all"> | "unknown";
    initials?: string;
    actorTone: "primary" | "secondary" | "system" | "muted";
    actorIcon?: ElementType;
    action: string;
    targetObject: string;
    ipAddress: string;
    result: AuditResult;
    description: string;
};
