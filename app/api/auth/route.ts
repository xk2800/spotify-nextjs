// app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI!;
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    // Redirect user to Spotify login
    const scope = "user-read-private user-read-email user-top-read user-top-read user-read-playback-state";
    const authURL = `${SPOTIFY_AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(scope)}`;
    console.log(authURL);

    return NextResponse.redirect(authURL);
  }


  // Exchange authorization code for access token
  try {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const { access_token, refresh_token, expires_in } = await response.json();

    // // Store tokens in secure cookies
    (await cookies()).set("spotify_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expires_in,
      path: "/",
    });

    (await cookies()).set("spotify_refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    // Store tokens in secure cookies
    // cookies().set("spotify_token", access_token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: expires_in,
    //   path: "/",
    // });

    // cookies().set("spotify_refresh_token", refresh_token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   path: "/",
    // });

    // return NextResponse.redirect("/dashboard");

    return NextResponse.redirect(new URL('/dashboard', req.url));

  } catch (error) {
    console.error("Error getting access token:", error);
    return NextResponse.json({ error: "Failed to get access token" }, { status: 500 });
  }
}