export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    timestamp?: string;
}

export interface PageResponse<T> {
    content: T[];
    pageable?: unknown;
    last?: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first?: boolean;
    numberOfElements?: number;
    empty?: boolean;
}
