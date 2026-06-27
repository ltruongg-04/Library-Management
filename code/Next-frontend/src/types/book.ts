export interface Book {
  id: number;
  title: string;
  authors: { id: number; name: string }[];
  publisher: string;
  publishYear: number;
  pages: number;
  isbn: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  availableQuantity: number;
  quantity: number;
  shelfLocation?: string;
  depositPrice?: number;
  categories: { id: number; name: string }[];
}

export interface BookListItem {
  id: number;
  title: string;
  authors: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  imageUrl: string;
  rating: number;
  availableQuantity: number;
  quantity?: number;
  status?: string;
  isbn?: string;
  shelfLocation?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface RelatedBook {
  id: number;
  title: string;
  authors: { id: number; name: string }[];
  coverImage: string;
}

export interface BookUpdateRequest {
  title?: string;
  authorIds?: number[];
  isbn?: string;
  categoryIds?: number[];
  status?: string;
  shelfLocation?: string;
  imageUrl?: string;
  quantity?: number;
  availableQuantity?: number;
}

