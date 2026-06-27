export interface Book {
  id: number;
  title: string;
  author: string;
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
  categories: string[];
}

export interface BookListItem {
  id: number;
  title: string;
  author: string;
  category: string;
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
  author: string;
  coverImage: string;
}

export interface BookUpdateRequest {
  title?: string;
  author?: string;
  isbn?: string;
  category?: string;
  status?: string;
  shelfLocation?: string;
  imageUrl?: string;
  quantity?: number;
  availableQuantity?: number;
}

