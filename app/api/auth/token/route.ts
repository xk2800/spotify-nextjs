// app/api/auth/token/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const TOKEN_URL = "https://accounts.spotify.com/api/token";

export async function GET() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token found" }, { status: 401 });
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const { access_token, expires_in } = await response.json();
    const cookieStore = await cookies();

    cookieStore.set("spotify_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expires_in,
      path: "/",
    });

    return NextResponse.json({ access_token });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
  }
}