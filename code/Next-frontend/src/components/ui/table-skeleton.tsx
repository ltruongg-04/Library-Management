import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
    columns: number;
    rows?: number;
}

export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                    <td colSpan={columns} className="px-6 py-4">
                        <div className="flex items-center gap-4">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <Skeleton
                                    key={colIndex}
                                    className="h-6 w-full"
                                    style={{
                                        opacity: 1 - rowIndex * 0.1, // Slight fade effect for rows
                                    }}
                                />
                            ))}
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}
