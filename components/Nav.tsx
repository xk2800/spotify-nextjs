"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";

const Nav: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/auth/get-token");
        if (!res.ok) throw new Error("Failed to fetch token");

        const data: { token: string } = await res.json();
        setIsAuthenticated(!!data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");

      setIsAuthenticated(false);
      router.push("/"); // Redirect to homepage
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!isAuthenticated) return null; // Hide Nav if user is not authenticated

  return (
    <nav className="flex justify-between items-center mb-4">
      <div>
        <Button asChild variant={'ghost'}>
          <Link href={'/'}>Profiler</Link>
        </Button>
      </div>
      <div>
        <Button asChild variant={'ghost'}>
          <Link href={'/time-machine'} className="hover:cursor-default">Album Time Machine</Link>
        </Button>
        <Button variant={'ghost'} onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
};

export default Nav;