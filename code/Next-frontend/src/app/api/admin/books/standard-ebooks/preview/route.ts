/* eslint-disable i18next/no-literal-string */
import { execFile } from "child_process";
import { NextResponse } from "next/server";
import path from "path";
import util from "util";
import { requireStaffSession } from "@/lib/auth";

const execFileAsync = util.promisify(execFile);

export async function GET(request: Request) {
    const staff = await requireStaffSession();
    if (staff.errorResponse) {
        return staff.errorResponse;
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url || !url.trim()) {
        return NextResponse.json({ success: false, message: "Vui lòng nhập đường link hoặc slug sách từ Standard Ebooks" }, { status: 400 });
    }

    try {
        const scriptPath = path.join(process.cwd(), "scripts", "convert_standard_ebook.py");
        const { stdout } = await execFileAsync("python", [scriptPath, "--url", url.trim(), "--preview-only"], {
            timeout: 20000,
            encoding: "utf-8",
        });

        const parsed = JSON.parse(stdout.trim());
        if (!parsed.success) {
            return NextResponse.json({ success: false, message: parsed.error || "Không thể lấy thông tin từ Standard Ebooks" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            data: parsed.data,
        });
    } catch (err: any) {
        console.error("Error previewing Standard Ebooks:", err);
        return NextResponse.json({ success: false, message: err.message || "Lỗi khi tìm nạp sách từ Standard Ebooks" }, { status: 500 });
    }
}
