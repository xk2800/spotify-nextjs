// app/page.tsx

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";


export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Spotify Profiler</CardTitle>
          <CardDescription>Login using your spotify account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/api/auth">
              Login with Spotify
            </Link>
          </Button>
        </CardContent>
        <CardFooter>
          <p>Made with &#10084;&#65039; by <Link href={'https://xavierkhew.com'} target="_blank" className="font-medium">Xavier K.</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}