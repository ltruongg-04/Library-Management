import { MaterialIcon } from "@/components/base/material-icon";
import { MY_BOOKS_PAGE } from "@/constants/ui-text/public";

type LoanFilterProps = {
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    startDate: string;
    setStartDate: (val: string) => void;
    endDate: string;
    setEndDate: (val: string) => void;
    onApply: () => void;
};

export const LoanFilter = ({ statusFilter, setStatusFilter, startDate, setStartDate, endDate, setEndDate, onApply }: LoanFilterProps) => {
    return (
        <div className="mb-lg flex flex-wrap items-center justify-between gap-md rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-md">
                <div className="flex flex-col gap-xs">
                    <label className="ml-1 text-body-sm text-on-surface-variant dark:text-slate-400">{MY_BOOKS_PAGE.FILTER.STATUS_LABEL}</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 min-w-[160px] cursor-pointer rounded-lg border-none bg-surface-container-low px-md text-body-sm focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white"
                    >
                        <option value={MY_BOOKS_PAGE.FILTER.STATUS_ALL}>{MY_BOOKS_PAGE.FILTER.STATUS_ALL}</option>
                        <option value={MY_BOOKS_PAGE.FILTER.STATUS_BORROWING}>{MY_BOOKS_PAGE.FILTER.STATUS_BORROWING}</option>
                        <option value={MY_BOOKS_PAGE.FILTER.STATUS_RETURNED}>{MY_BOOKS_PAGE.FILTER.STATUS_RETURNED}</option>
                        <option value={MY_BOOKS_PAGE.FILTER.STATUS_OVERDUE}>{MY_BOOKS_PAGE.FILTER.STATUS_OVERDUE}</option>
                        <option value={MY_BOOKS_PAGE.FILTER.STATUS_PENDING}>{MY_BOOKS_PAGE.FILTER.STATUS_PENDING}</option>
                        <option value={MY_BOOKS_PAGE.FILTER.STATUS_CANCELLED}>{MY_BOOKS_PAGE.FILTER.STATUS_CANCELLED}</option>
                    </select>
                </div>
                <div className="flex flex-col gap-xs">
                    <label className="ml-1 text-body-sm text-on-surface-variant dark:text-slate-400">{MY_BOOKS_PAGE.FILTER.DATE_RANGE_LABEL}</label>
                    <div className="flex items-center gap-sm">
                        <input
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="relative h-10 w-full cursor-pointer rounded-lg border-none bg-surface-container-low px-md text-body-sm text-on-surface transition-all [color-scheme:light] focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                            type="date"
                        />
                        <span className="text-body-sm text-outline">{MY_BOOKS_PAGE.FILTER.DATE_TO}</span>
                        <input
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="relative h-10 w-full cursor-pointer rounded-lg border-none bg-surface-container-low px-md text-body-sm text-on-surface transition-all [color-scheme:light] focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                            type="date"
                        />
                    </div>
                </div>
            </div>
            <button
                onClick={onApply}
                className="flex h-10 items-center gap-sm self-end rounded-lg bg-primary px-lg font-body-md text-body-sm text-on-primary transition-all hover:bg-primary-container"
            >
                <MaterialIcon name="filter_list" className="text-[20px]" />
                {MY_BOOKS_PAGE.FILTER.APPLY_BUTTON}
            </button>
        </div>
    );
};
