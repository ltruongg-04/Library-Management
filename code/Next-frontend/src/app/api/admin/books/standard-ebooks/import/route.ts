/* eslint-disable i18next/no-literal-string */
import { execFile } from "child_process";
import fs from "fs";
import { NextResponse } from "next/server";
import os from "os";
import path from "path";
import util from "util";
import { getServerBackendUrl } from "@/config/env";
import { requireStaffSession } from "@/lib/auth";

const execFileAsync = util.promisify(execFile);
const BACKEND_URL = getServerBackendUrl();

export async function POST(request: Request) {
    try {
        const staff = await requireStaffSession();
        if (staff.errorResponse) {
            return staff.errorResponse;
        }

        const body = await request.json();
        const { url, previewPages = 5, isFree = false, minMembershipTierId = null, depositPrice, initialQuantity, shelfLocation } = body;

        if (!url || !url.trim()) {
            return NextResponse.json({ success: false, message: "Thiếu đường link sách Standard Ebooks" }, { status: 400 });
        }

        const forwardHeaders: Record<string, string> = { Authorization: `Bearer ${staff.backendToken}` };

        // 1. Generate temp JSON package path
        const tempJsonName = `se_${Date.now()}_${Math.random().toString(36).substring(7)}.json`;
        const tempJsonPath = path.join(os.tmpdir(), tempJsonName);

        const scriptPath = path.join(process.cwd(), "scripts", "convert_standard_ebook.py");

        // 2. Run conversion script to extract Web Reader package
        const { stdout } = await execFileAsync("python", [scriptPath, "--url", url.trim(), "--out-json", tempJsonPath], {
            timeout: 90000,
            encoding: "utf-8",
        });

        const parsed = JSON.parse(stdout.trim());
        if (!parsed.success) {
            return NextResponse.json({ success: false, message: parsed.error || "Chuyển đổi sách thất bại" }, { status: 400 });
        }

        const data = parsed.data;

        let bookId = body.bookId;
        let createdBook = null;

        // 3. Create book in Spring Boot backend if bookId is not provided
        if (!bookId) {
            const createBookPayload = {
                title: data.title,
                newAuthors: [data.author || "Tác giả cổ điển"],
                description: data.description,
                publisher: "Standard Ebooks",
                imageUrl: data.cover,
                pages: data.totalPages,
                depositPrice: depositPrice || 100000,
                initialQuantity: initialQuantity ?? 5,
                shelfLocation: shelfLocation || "KHO-SE-01",
                newCategories: ["Văn học cổ điển"],
                newTags: ["Standard Ebooks", "Sách mềm", "Web Reader"],
            };

            const createRes = await fetch(`${BACKEND_URL}/api/admin/books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...forwardHeaders,
                },
                body: JSON.stringify(createBookPayload),
            });

            const createJson = await createRes.json();
            if (!createRes.ok) {
                // Clean up temp file
                if (fs.existsSync(tempJsonPath)) fs.unlinkSync(tempJsonPath);
                return NextResponse.json(
                    { success: false, message: createJson.message || "Không thể tạo sách trong cơ sở dữ liệu" },
                    { status: createRes.status },
                );
            }

            createdBook = createJson.data || createJson;
            bookId = createdBook.id;
        }

        // 4. Upload extracted JSON Web Reader as Ebook
        if (fs.existsSync(tempJsonPath)) {
            const fileBuffer = fs.readFileSync(tempJsonPath);
            const blob = new Blob([fileBuffer], { type: "application/json" });
            const formData = new FormData();
            formData.append("file", blob, `${data.title}.json`);
            formData.append("previewPages", String(previewPages));
            formData.append("isFree", String(isFree));
            if (minMembershipTierId) {
                formData.append("minMembershipTierId", String(minMembershipTierId));
            }
            formData.append("totalPages", String(data.totalChapters || data.totalPages));

            const ebookRes = await fetch(`${BACKEND_URL}/api/admin/books/${bookId}/ebook`, {
                method: "POST",
                headers: {
                    ...forwardHeaders,
                },
                body: formData,
            });

            // Cleanup temp file
            try {
                fs.unlinkSync(tempJsonPath);
            } catch (cleanupErr) {
                console.warn("Failed to delete temp JSON:", cleanupErr);
            }

            if (!ebookRes.ok) {
                const ebookErr = await ebookRes.json().catch(() => ({}));
                const errMsg = ebookErr.message || `Lỗi tải sách mềm lên máy chủ (${ebookRes.status})`;
                console.error("Ebook upload failed:", errMsg);
                return NextResponse.json({ success: false, message: errMsg }, { status: ebookRes.status });
            }
        }

        return NextResponse.json({
            success: true,
            data: createdBook,
            message: `Đã nhập thành công cuốn sách "${data.title}" và tạo sách mềm đọc online!`,
        });
    } catch (err: any) {
        console.error("Error importing from Standard Ebooks:", err);
        return NextResponse.json({ success: false, message: err.message || "Lỗi khi nhập sách từ Standard Ebooks" }, { status: 500 });
    }
}
