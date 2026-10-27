export interface EbookInfo {
    id: number;
    bookId: number;
    bookTitle: string;
    fileName: string;
    fileFormat: string;
    fileSizeBytes: number;
    totalPages: number;
    previewPages: number;
    isFree: boolean;
    minMembershipTierId?: number | null;
    minMembershipTierName?: string | null;
    isActive: boolean;
    canReadFull: boolean;
    previewOnly: boolean;
    allowedPages: number;
    accessReason: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface EbookUpdateRequest {
    previewPages?: number;
    isFree?: boolean;
    minMembershipTierId?: number | null;
    isActive?: boolean;
}
