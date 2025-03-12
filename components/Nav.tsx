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

      // Make sure we navigate before changing the auth state
      await router.push("/");

      // Update auth state after navigation is initiated
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      {isAuthenticated && (
        <nav className="flex justify-between items-center">
          <div><Link href={'/'}>Nav</Link></div>
          <div>
            <Link href={'/time-machine'}>New Feature</Link>
            <Button variant={'ghost'} onClick={handleLogout}>Logout</Button>
          </div>
        </nav>
      )}
    </>
  );
};

export default Nav;