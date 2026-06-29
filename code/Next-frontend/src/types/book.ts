// Types khớp với BookResponse và BookPageResponse từ backend

export interface Book {
    id: number;
    title: string;
    authors: { id: number; name: string }[];
    publisher: string;
    publicationDate: string;
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
    aiMatchScore?: number;
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

export interface BookUpdateRequest {
    title?: string;
    authorIds?: number[];
    newAuthors?: string[];
    isbn?: string;
    categoryIds?: number[];
    newCategories?: string[];
    shelfLocation?: string;
    imageUrl?: string;
    description?: string;
    publisher?: string;
    publicationDate?: string;
    pages?: number;
    quantity?: number;
    availableQuantity?: number;
}

export interface BookCreateRequest {
    title: string;
    authorIds?: number[];
    newAuthors?: string[];
    isbn?: string;
    categoryIds?: number[];
    newCategories?: string[];
    shelfLocation?: string;
    imageUrl?: string;
    description?: string;
    publisher?: string;
    publicationDate?: string;
    pages?: number;
    depositPrice?: number;
}

/**
 * Chuyển đổi Book (từ API) sang BookDetail (cho components hiện tại)
 * Components detail page đang dùng BookDetail interface cũ
 */
export function bookToBookDetail(book: Book): BookDetail {
    return {
        id: book.id,
        title: book.title,
        author: book.authors?.map(a => a.name).join(", ") || "",
        publisher: book.publisher || "",
        publishedDate: book.publicationDate || "",
        pages: book.pages || 0,
        isbn: book.isbn || "",
        description: book.description || "",
        coverImage: book.imageUrl || "",
        rating: book.rating || 0,
        reviewCount: book.reviewCount || 0,
        availableCount: book.availableQuantity || 0,
        totalCount: book.quantity || 0,
        shelfLocation: book.shelfLocation,
        depositPrice: book.depositPrice,
        categories: book.categories?.map(c => c.name) || [],
    };
}
