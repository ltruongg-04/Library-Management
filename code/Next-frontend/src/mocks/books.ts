import type { Book, BookPageResponse, BookSearchParams } from "@/types/book";

const DEFAULT_PAGE_SIZE = 12;
const FIRST_PAGE_INDEX = 0;

export const FALLBACK_BOOKS: Book[] = [
    {
        id: 1,
        title: "The Philosophy of Artificial Intelligence",
        authors: [{ id: 1, name: "Mara Ellison" }],
        publisher: "Lumina Academic Press",
        publicationDate: "2024-03-18",
        pages: 352,
        isbn: "978-1-4450-1001-2",
        description: "A clear survey of the ethical, social, and cognitive questions behind modern AI systems.",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewCount: 128,
        availableQuantity: 7,
        quantity: 12,
        shelfLocation: "AI-204",
        depositPrice: 50000,
        categories: [{ id: 1, name: "Khoa học & Công nghệ" }],
        tags: [],
        aiMatchScore: 98,
    },
    {
        id: 2,
        title: "Hard Sci-Fi Essentials",
        authors: [{ id: 2, name: "Julian Park" }],
        publisher: "Northstar Library",
        publicationDate: "2023-11-02",
        pages: 288,
        isbn: "978-1-4450-1002-9",
        description: "A curated guide to speculative fiction rooted in credible science and engineering.",
        imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewCount: 84,
        availableQuantity: 5,
        quantity: 9,
        shelfLocation: "SF-118",
        depositPrice: 45000,
        categories: [{ id: 2, name: "Tiểu thuyết" }],
        tags: [],
        aiMatchScore: 92,
    },
    {
        id: 3,
        title: "World Building Masterclass",
        authors: [{ id: 3, name: "Elena Voss" }],
        publisher: "Atlas Creative",
        publicationDate: "2022-08-14",
        pages: 416,
        isbn: "978-1-4450-1003-6",
        description: "Techniques for building coherent fictional worlds, cultures, maps, and histories.",
        imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewCount: 96,
        availableQuantity: 6,
        quantity: 10,
        shelfLocation: "WR-042",
        depositPrice: 40000,
        categories: [{ id: 4, name: "Thiết kế & Nghệ thuật" }],
        tags: [],
        aiMatchScore: 85,
    },
    {
        id: 4,
        title: "History of Knowledge Systems",
        authors: [{ id: 4, name: "Nguyen An" }],
        publisher: "Civic Archive",
        publicationDate: "2021-05-27",
        pages: 310,
        isbn: "978-1-4450-1004-3",
        description: "How libraries, indexes, and digital repositories changed the way societies preserve memory.",
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
        rating: 4.5,
        reviewCount: 72,
        availableQuantity: 4,
        quantity: 8,
        shelfLocation: "HI-076",
        depositPrice: 35000,
        categories: [{ id: 3, name: "Lịch sử" }],
        tags: [],
        aiMatchScore: 88,
    },
    {
        id: 5,
        title: "Designing Quiet Interfaces",
        authors: [{ id: 5, name: "Sofia Klein" }],
        publisher: "Interface Studio",
        publicationDate: "2024-01-09",
        pages: 244,
        isbn: "978-1-4450-1005-0",
        description: "A practical guide to calm, accessible, and highly usable digital products.",
        imageUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=600&q=80",
        rating: 4.4,
        reviewCount: 58,
        availableQuantity: 9,
        quantity: 14,
        shelfLocation: "UX-019",
        depositPrice: 30000,
        categories: [{ id: 4, name: "Thiết kế & Nghệ thuật" }],
        tags: [],
        aiMatchScore: 81,
    },
    {
        id: 6,
        title: "Business Models for Digital Libraries",
        authors: [{ id: 6, name: "Victor Hale" }],
        publisher: "Marketline Press",
        publicationDate: "2020-10-22",
        pages: 276,
        isbn: "978-1-4450-1006-7",
        description: "Operational models, funding strategies, and analytics for sustainable library platforms.",
        imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
        rating: 4.3,
        reviewCount: 41,
        availableQuantity: 3,
        quantity: 6,
        shelfLocation: "BM-033",
        depositPrice: 32000,
        categories: [{ id: 5, name: "Kinh doanh" }],
        tags: [],
        aiMatchScore: 79,
    },
];

export function getFallbackBookPage(params: BookSearchParams = {}): BookPageResponse {
    const page = params.page ?? FIRST_PAGE_INDEX;
    const size = params.size ?? DEFAULT_PAGE_SIZE;
    const keyword = params.keyword?.trim().toLowerCase();
    const category = params.category?.trim().toLowerCase();

    let filteredBooks = FALLBACK_BOOKS.filter((book) => {
        const matchesKeyword =
            !keyword ||
            book.title.toLowerCase().includes(keyword) ||
            book.authors.some((author) => author.name.toLowerCase().includes(keyword)) ||
            book.categories.some((bookCategory) => bookCategory.name.toLowerCase().includes(keyword));
        const matchesCategory = !category || category === "all" || book.categories.some((bookCategory) => bookCategory.name.toLowerCase() === category);

        return matchesKeyword && matchesCategory;
    });

    filteredBooks = sortFallbackBooks(filteredBooks, params.sortBy);

    const totalElements = filteredBooks.length;
    const totalPages = Math.max(Math.ceil(totalElements / size), 1);
    const startIndex = page * size;
    const content = filteredBooks.slice(startIndex, startIndex + size);

    return {
        content,
        page,
        size,
        totalElements,
        totalPages,
        last: page >= totalPages - 1,
    };
}

export function getFallbackBookById(id: number) {
    return FALLBACK_BOOKS.find((book) => book.id === id) || null;
}

function sortFallbackBooks(books: Book[], sortBy: BookSearchParams["sortBy"]) {
    const sortedBooks = [...books];

    if (sortBy === "title") {
        return sortedBooks.sort((firstBook, secondBook) => firstBook.title.localeCompare(secondBook.title));
    }

    if (sortBy === "author") {
        return sortedBooks.sort((firstBook, secondBook) => {
            const firstAuthor = firstBook.authors[0]?.name || "";
            const secondAuthor = secondBook.authors[0]?.name || "";

            return firstAuthor.localeCompare(secondAuthor);
        });
    }

    return sortedBooks.sort((firstBook, secondBook) => secondBook.publicationDate.localeCompare(firstBook.publicationDate));
}
