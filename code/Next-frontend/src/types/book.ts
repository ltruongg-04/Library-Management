export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  pages: number;
  isbn: string;
  description: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  availableCount: number;
  totalCount: number;
  shelfLocation?: string;
  depositPrice?: number;
  categories: string[];
  aiMatchScore?: number;
}

export interface RelatedBook {
  id: number;
  title: string;
  author: string;
  coverImage: string;
}
