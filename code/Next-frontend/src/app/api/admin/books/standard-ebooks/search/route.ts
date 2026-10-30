/* eslint-disable i18next/no-literal-string */
import { execFile } from "child_process";
import { NextResponse } from "next/server";
import path from "path";
import util from "util";

const execFileAsync = util.promisify(execFile);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const author = searchParams.get("author") || "";

    if (!title || !title.trim()) {
        return NextResponse.json({ success: true, found: false, data: null });
    }

    try {
        const scriptPath = path.join(process.cwd(), "scripts", "convert_standard_ebook.py");
        const args = [scriptPath, "--search", title.trim()];
        if (author && author.trim()) {
            args.push("--author", author.trim());
        }

        const { stdout } = await execFileAsync("python", args, {
            timeout: 15000,
            encoding: "utf-8",
        });

        const parsed = JSON.parse(stdout.trim());
        return NextResponse.json(parsed);
    } catch (err: any) {
        console.warn("Error searching Standard Ebooks in background:", err.message);
        // Do not fail the search request; just report not found
        return NextResponse.json({ success: true, found: false, data: null });
    }
}
