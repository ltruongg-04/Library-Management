import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/books/top-rated`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache trong 60 giây
    });

    if (!res.ok) {
      throw new Error(`Backend API returned status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying to backend (top-rated books):", error);
    return NextResponse.json(
      { message: "Lỗi kết nối đến server backend", data: [] },
      { status: 500 }
    );
  }
}
