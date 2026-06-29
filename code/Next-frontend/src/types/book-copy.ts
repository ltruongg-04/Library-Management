export type BookCopyStatus = 'AVAILABLE' | 'BORROWED' | 'LOST' | 'DAMAGED' | 'MAINTENANCE';

export interface BookCopy {
  id: number;
  bookId: number;
  barcode: string;
  status: BookCopyStatus;
  conditionNote?: string;
}

export interface BookCopyUpdateRequest {
  status: BookCopyStatus;
  conditionNote?: string;
}
