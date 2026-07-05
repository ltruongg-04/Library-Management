import React from "react";

export function FeaturedSkeleton() {
    return (
        <div className="level-1-shadow min-h-[320px] animate-pulse overflow-hidden rounded-2xl bg-surface-container-lowest dark:bg-slate-900">
            <div className="h-full min-h-[320px] w-full bg-surface-container-low dark:bg-slate-800" />
        </div>
    );
}

export function SmallSkeleton() {
    return (
        <div className="level-1-shadow flex flex-1 animate-pulse flex-col gap-3 rounded-xl bg-surface-container-lowest p-5 dark:bg-slate-900">
            <div className="h-10 w-10 rounded-xl bg-surface-container-low dark:bg-slate-800" />
            <div className="h-4 w-2/3 rounded bg-surface-container-low dark:bg-slate-800" />
            <div className="h-3 w-full rounded bg-surface-container-low dark:bg-slate-800" />
            <div className="h-3 w-4/5 rounded bg-surface-container-low dark:bg-slate-800" />
            <div className="mt-auto flex gap-2 pt-2">
                <div className="h-7 w-7 rounded bg-surface-container-low dark:bg-slate-800" />
                <div className="h-7 w-7 rounded bg-surface-container-low dark:bg-slate-800" />
                <div className="h-7 w-7 rounded bg-surface-container-low dark:bg-slate-800" />
            </div>
        </div>
    );
}
