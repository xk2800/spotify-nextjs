import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("spotify_token")?.value || "";
  return NextResponse.json({ token });
}