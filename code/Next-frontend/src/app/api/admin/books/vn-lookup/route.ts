/* eslint-disable i18next/no-literal-string */
import { NextResponse } from "next/server";

const FAHASA_ELASTIC_URL = "https://www.fahasa.com/api/elsearch/api/as/v1/engines/fhs-production-v2/search";
const FAHASA_AUTH_TOKEN = "Bearer search-zs5622edvxg9bt9nb5y9m2oo";

interface NormalizedBookData {
    title: string;
    authors: string[];
    publisher?: string;
    publicationDate?: string;
    pages?: number;
    description?: string;
    categories?: string[];
    tags?: string[];
    isbn: string;
    imageUrl?: string;
}

// 1. Tìm kiếm và lấy chi tiết sách từ Tiki
async function searchTiki(query: string): Promise<NormalizedBookData | null> {
    try {
        const searchRes = await fetch(`https://tiki.vn/api/v2/products?q=${encodeURIComponent(query)}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "application/json",
            },
            signal: AbortSignal.timeout(8000),
        });

        if (!searchRes.ok) return null;
        const searchData = await searchRes.json();

        if (!searchData.data || searchData.data.length === 0) {
            return null;
        }

        const firstItem = searchData.data[0];
        const detailRes = await fetch(`https://tiki.vn/api/v2/products/${firstItem.id}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "application/json",
            },
            signal: AbortSignal.timeout(8000),
        });

        if (!detailRes.ok) {
            return {
                title: firstItem.name || "",
                authors: firstItem.authors ? firstItem.authors.map((a: any) => a.name) : [],
                isbn: query,
                imageUrl: firstItem.thumbnail_url || undefined,
            };
        }

        const d = await detailRes.json();

        let publisher = d.seller_name || undefined;
        let publicationDate: string | undefined = undefined;
        let pages: number | undefined = undefined;

        if (d.specifications && Array.isArray(d.specifications)) {
            for (const spec of d.specifications) {
                if (spec.attributes && Array.isArray(spec.attributes)) {
                    for (const attr of spec.attributes) {
                        const attrName = (attr.name || "").toLowerCase();
                        if (attrName.includes("nhà xuất bản") || attrName.includes("công ty phát hành")) {
                            publisher = attr.value;
                        } else if (attrName.includes("số trang")) {
                            const p = parseInt(attr.value);
                            if (!isNaN(p)) pages = p;
                        } else if (attrName.includes("ngày xuất bản")) {
                            publicationDate = attr.value ? String(attr.value).split(" ")[0] : undefined;
                        }
                    }
                }
            }
        }

        const rawDesc = d.description || d.short_description || "";
        const cleanDesc = rawDesc
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        return {
            title: d.name || "",
            authors: d.authors && Array.isArray(d.authors) ? d.authors.map((a: any) => a.name) : [],
            publisher: publisher,
            publicationDate: publicationDate,
            pages: pages,
            description: cleanDesc,
            categories: d.categories ? [d.categories.name].filter(Boolean) : [],
            isbn: query,
            imageUrl: d.images?.[0]?.base_url || d.thumbnail_url || undefined,
        };
    } catch (err) {
        console.warn("[Tiki Search Error]:", err);
        return null;
    }
}

const FAHASA_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

// Trích xuất chi tiết sách từ trang sản phẩm Fahasa
async function fetchFahasaDetail(productUrl: string): Promise<Partial<NormalizedBookData> | null> {
    try {
        const fullUrl = productUrl.startsWith("http") ? productUrl : `https://www.fahasa.com${productUrl}`;
        const res = await fetch(fullUrl, {
            headers: {
                "User-Agent": FAHASA_USER_AGENT,
            },
            signal: AbortSignal.timeout(8000),
        });

        if (!res.ok) return null;
        const html = await res.text();

        const details: Partial<NormalizedBookData> = {};

        // 1. Phân tích LD+JSON schema cho Book/Product
        const ldRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
        let match;
        while ((match = ldRegex.exec(html)) !== null) {
            try {
                const parsed = JSON.parse(match[1]);
                const graph = parsed["@graph"] || (parsed["@type"]?.includes("Book") ? parsed : null);

                if (graph && (graph["@type"]?.includes("Book") || graph["@type"]?.includes("Product"))) {
                    if (graph.name) details.title = graph.name;
                    if (graph.image?.url) details.imageUrl = graph.image.url;
                    if (graph.author?.name) {
                        const cleanAuthor = String(graph.author.name)
                            .replace(/[Ì"\\\/]+$/g, "")
                            .trim();
                        if (cleanAuthor) details.authors = [cleanAuthor];
                    }
                    if (graph.description) {
                        details.description = String(graph.description)
                            .replace(/<[^>]+>/g, " ")
                            .replace(/\s+/g, " ")
                            .trim();
                    }

                    if (Array.isArray(graph.additionalProperty)) {
                        for (const prop of graph.additionalProperty) {
                            const pName = (prop.name || "").trim().toLowerCase();
                            const pVal = String(prop.value || "").trim();
                            if (!pVal) continue;

                            if (pName.includes("tác giả") && (!details.authors || details.authors.length === 0)) {
                                const cleanAuthor = pVal.replace(/[Ì"\\\/]+$/g, "").trim();
                                if (cleanAuthor) details.authors = [cleanAuthor];
                            } else if (pName.includes("nhà xuất bản") || pName.includes("nhà cung cấp")) {
                                details.publisher = pVal;
                            } else if (pName.includes("năm xb")) {
                                const yearMatch = pVal.match(/\b(19\d\d|20\d\d)\b/);
                                if (yearMatch) details.publicationDate = `${yearMatch[1]}-01-01`;
                            } else if (pName.includes("số trang")) {
                                const p = parseInt(pVal);
                                if (!isNaN(p)) details.pages = p;
                            }
                        }
                    }
                } else if (parsed["@type"] === "BreadcrumbList" && Array.isArray(parsed.itemListElement)) {
                    const cats = parsed.itemListElement
                        .map((item: any) => item.item?.name)
                        .filter((name: any) => name && name !== "Fahasa" && !name.includes("trang chủ"));
                    if (cats.length > 0 && (!details.categories || details.categories.length === 0)) {
                        details.categories = cats;
                    }
                }
            } catch {
                // Tiếp tục duyệt các thẻ script khác
            }
        }

        // 2. Lấy mô tả chi tiết từ thẻ HTML nếu LD+JSON thiếu
        if (!details.description || details.description.length < 50) {
            const descMatch = html.match(/<div id="desc_content"[^>]*>([\s\S]*?)<\/div>/) || html.match(/<div id="product-tabs-desc"[^>]*>([\s\S]*?)<\/div>/);
            if (descMatch) {
                details.description = descMatch[1]
                    .replace(/<[^>]+>/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();
            }
        }

        return details;
    } catch (err) {
        console.warn("[Fahasa Detail Fetch Error]:", err);
        return null;
    }
}

// 2. Fallback tìm kiếm từ Fahasa
async function searchFahasa(query: string): Promise<NormalizedBookData | null> {
    try {
        const fahasaRes = await fetch(FAHASA_ELASTIC_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: FAHASA_AUTH_TOKEN,
                "User-Agent": FAHASA_USER_AGENT,
            },
            body: JSON.stringify({ query: query }),
            signal: AbortSignal.timeout(8000),
        });

        if (!fahasaRes.ok) return null;
        const data = await fahasaRes.json();

        if (!data.results || data.results.length === 0) {
            return null;
        }

        const item = data.results[0];
        const title = item.title?.raw || "";
        const thumbnail = item.thumbnail?.raw || undefined;
        const sku = item.sku?.raw || query;
        const link = item.link?.raw;

        // Trích xuất chi tiết từ trang sản phẩm Fahasa
        let pageDetails: Partial<NormalizedBookData> | null = null;
        if (link) {
            pageDetails = await fetchFahasaDetail(link);
        }

        let authors: string[] = pageDetails?.authors || [];
        let publisher: string | undefined = pageDetails?.publisher;
        let publicationDate: string | undefined = pageDetails?.publicationDate;
        let pages: number | undefined = pageDetails?.pages;
        let description = pageDetails?.description || "";
        let categories = pageDetails?.categories || ["Sách ngoại văn / Ngoại ngữ"];
        let finalTitle = pageDetails?.title || title;
        let finalImage = pageDetails?.imageUrl || thumbnail;

        // Nếu Fahasa vẫn thiếu tác giả hoặc mô tả, thử tìm kiếm bổ sung trên Tiki dựa vào tên sách
        if ((!authors || authors.length === 0 || !description) && finalTitle) {
            const cleanTitle = finalTitle
                .replace(/\(.*?\)/g, "")
                .replace(/\[.*?\]/g, "")
                .trim();
            const enriched = await searchTiki(cleanTitle);
            if (enriched) {
                if (!authors || authors.length === 0) authors = enriched.authors;
                if (!publisher) publisher = enriched.publisher;
                if (!pages) pages = enriched.pages;
                if (!publicationDate) publicationDate = enriched.publicationDate;
                if (!description) description = enriched.description || "";
            }
        }

        return {
            title: finalTitle,
            authors: authors,
            publisher: publisher,
            publicationDate: publicationDate,
            pages: pages,
            description: description,
            isbn: sku,
            imageUrl: finalImage,
            categories: categories,
        };
    } catch (err) {
        console.warn("[Fahasa Search Error]:", err);
        return null;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || searchParams.get("barcode") || searchParams.get("isbn");

    if (!query || !query.trim()) {
        return NextResponse.json({ success: false, message: "Thiếu từ khóa hoặc mã barcode" }, { status: 400 });
    }

    const trimmed = query.trim();

    // 1. Thử tìm kiếm trên Tiki trước
    const tikiBook = await searchTiki(trimmed);
    if (tikiBook && tikiBook.title) {
        return NextResponse.json({ success: true, source: "tiki", data: tikiBook });
    }

    // 2. Nếu Tiki không có kết quả -> Fallback sang Fahasa
    const fahasaBook = await searchFahasa(trimmed);
    if (fahasaBook && fahasaBook.title) {
        return NextResponse.json({ success: true, source: "fahasa", data: fahasaBook });
    }

    return NextResponse.json({ success: false, message: "Không tìm thấy sách trên Tiki và Fahasa" }, { status: 404 });
}
