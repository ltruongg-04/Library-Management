import { UI_TEXT } from "@/constants/ui-text";
import type { ReviewsStats } from "@/types/admin-review";

const TEXT = UI_TEXT.ADMIN_REVIEWS;

type ReviewsStatsPanelProps = {
    stats: ReviewsStats;
};

function StatPill({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-h-[76px] w-[150px] rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-sm">
            <p className="font-label-caps text-[11px] leading-4 text-on-surface-variant">{label}</p>
            <p className="mt-xs text-title-md font-semibold text-primary">{value}</p>
        </div>
    );
}

export default function ReviewsStatsPanel({ stats }: ReviewsStatsPanelProps) {
    return (
        <aside className="grid h-fit w-max grid-cols-2 gap-sm xl:grid-cols-1">
            <StatPill label={TEXT.STATS.TOTAL} value={stats.total} />
            <StatPill label={TEXT.STATS.REPORTED} value={stats.reported} />
            <StatPill label={TEXT.STATS.HIDDEN} value={stats.hidden} />
            <StatPill label={TEXT.STATS.AVERAGE} value={stats.average} />
        </aside>
    );
}
