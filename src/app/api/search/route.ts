import { NextResponse } from "next/server";
import { performSearch } from "@/lib/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = performSearch(q);
  return NextResponse.json({ results });
}
