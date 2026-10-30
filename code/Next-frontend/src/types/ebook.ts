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

export interface WebReaderTocItem {
    id: string;
    title: string;
    file: string;
    index: number;
}

export interface WebReaderChapter {
    id: string;
    file: string;
    title: string;
    html: string;
    wordCount: number;
}

export interface WebReaderPackage {
    version: number;
    format: "WEB_READER";
    title: string;
    author: string;
    description: string;
    totalChapters: number;
    totalWords: number;
    estimatedReadingMinutes: number;
    toc: WebReaderTocItem[];
    chapters: WebReaderChapter[];
}
