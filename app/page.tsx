// app/page.tsx
export default function Home() {
  return (
    <div>
      <h1>Spotify Authentication</h1>
      <a href="/api/auth">
        <button>Login with Spotify</button>
      </a>
    </div>
  );
}