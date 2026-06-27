// Types khớp với BookResponse và BookPageResponse từ backend

export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publisher: string;
    publishYear: number | null;
    quantity: number;
    availableQuantity: number;
    category: string;
    description: string;
    imageUrl: string | null;
}

export interface BookPageResponse {
    content: Book[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface BookSearchParams {
    keyword?: string;
    category?: string;
    page?: number;
    size?: number;
    sortBy?: "newest" | "title" | "author";
}

// Legacy type for book detail page components — maps từ Book
export interface BookDetail {
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

/**
 * Chuyển đổi Book (từ API) sang BookDetail (cho components hiện tại)
 * Components detail page đang dùng BookDetail interface cũ
 */
export function bookToBookDetail(book: Book): BookDetail {
    return {
        id: book.id,
        title: book.title,
        author: book.author,
        publisher: book.publisher || "",
        publishedDate: book.publishYear ? String(book.publishYear) : "",
        pages: 0,
        isbn: book.isbn || "",
        description: book.description || "",
        coverImage: book.imageUrl || "",
        rating: 0,
        reviewCount: 0,
        availableCount: book.availableQuantity,
        totalCount: book.quantity,
        shelfLocation: undefined,
        depositPrice: undefined,
        categories: book.category ? [book.category] : [],
        aiMatchScore: undefined,
    };
}
