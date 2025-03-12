import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  const token = (await cookies()).get("spotify_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No access token found" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const timeRange = searchParams.get('time_range') ?? 'medium_term';
  const offset = searchParams.get('offset') ?? '0';
  const limit = '10'; // Fixed at 10 per load

  // console.log(timeRange);


  try {
    const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    // console.log(response);


    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return Response.json({ error: errorMessage }, { status: 500 });
  }

}