/**
 * Utility functions for parsing and validating barcodes and QR codes for books.
 */

/**
 * Trích xuất mã ISBN từ chuỗi quét được từ QR Code hoặc Barcode.
 * Hỗ trợ các trường hợp:
 * 1. Chuỗi JSON (ví dụ: {"isbn": "9786043658231", ...})
 * 2. Đường link URL (ví dụ: https://.../isbn/9786043658231 hoặc ...?isbn=978...)
 * 3. Chuỗi có tiền tố (ví dụ: "ISBN: 978-604-365-823-1")
 * 4. Chuỗi số mã vạch EAN-13 / ISBN-13 hoặc ISBN-10 thông thường
 */
export function extractIsbnFromScannedText(rawText: string): string {
    if (!rawText) return "";
    const text = rawText.trim();

    // 1. Kiểm tra nếu là chuỗi JSON
    if (text.startsWith("{") && text.endsWith("}")) {
        try {
            const parsed = JSON.parse(text);
            if (parsed.isbn) {
                return cleanIsbnString(String(parsed.isbn));
            }
            if (parsed.code) {
                return cleanIsbnString(String(parsed.code));
            }
        } catch {
            // Không phải JSON hợp lệ, tiếp tục xử lý bên dưới
        }
    }

    // 2. Tìm kiếm ISBN-13 bằng Regex (bắt đầu bằng 978 hoặc 979, có hoặc không có dấu gạch ngang)
    const isbn13Regex = /(?:ISBN(?:-13)?:?\s*)?(97[89][-\s]?[0-9]{1,5}[-\s]?[0-9]+[-\s]?[0-9]+[-\s]?[0-9])/i;
    const match13 = text.match(isbn13Regex);
    if (match13 && match13[1]) {
        return cleanIsbnString(match13[1]);
    }

    // 3. Tìm kiếm ISBN-10 bằng Regex (10 ký tự số hoặc kết thúc bằng X)
    const isbn10Regex = /(?:ISBN(?:-10)?:?\s*)?([0-9]{1,5}[-\s]?[0-9]+[-\s]?[0-9]+[-\s]?[0-9X])/i;
    const match10 = text.match(isbn10Regex);
    if (match10 && match10[1]) {
        const cleaned = cleanIsbnString(match10[1]);
        if (cleaned.length === 10) {
            return cleaned;
        }
    }

    // 4. Tìm trong URL params (ví dụ: ?isbn=... hoặc /book/...)
    if (text.includes("http://") || text.includes("https://")) {
        try {
            const url = new URL(text);
            const isbnParam = url.searchParams.get("isbn") || url.searchParams.get("q") || url.searchParams.get("barcode");
            if (isbnParam) {
                return cleanIsbnString(isbnParam);
            }
            // Thử trích xuất từ pathname
            const segments = url.pathname.split("/").filter(Boolean);
            for (const seg of segments) {
                const cleanedSeg = cleanIsbnString(seg);
                if (isValidIsbnLength(cleanedSeg)) {
                    return cleanedSeg;
                }
            }
        } catch {
            // URL parse fail
        }
    }

    // 5. Fallback: Lấy toàn bộ số / chữ cái X và kiểm tra độ dài
    const fallbackClean = cleanIsbnString(text);
    if (isValidIsbnLength(fallbackClean)) {
        return fallbackClean;
    }

    return text;
}

/**
 * Loại bỏ ký tự đặc biệt, dấu gạch ngang, khoảng trắng
 */
export function cleanIsbnString(isbn: string): string {
    return isbn.replace(/[^0-9X]/gi, "").toUpperCase();
}

/**
 * Kiểm tra độ dài cơ bản của ISBN (10 hoặc 13 số)
 */
export function isValidIsbnLength(isbn: string): boolean {
    const cleaned = cleanIsbnString(isbn);
    return cleaned.length === 10 || cleaned.length === 13;
}
