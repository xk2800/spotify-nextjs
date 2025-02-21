// app/page.tsx

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <h1>Spotify Authentication</h1>
      <a href="/api/auth">
        <Button>Login with Spotify</Button>
      </a>
    </div>
  );
}