"use client";

import { Button, Chip, Surface } from "@heroui/react";
import MenuDropdown from "./MenuDropdown";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dot } from "lucide-react";

const Navbar = () => {
  const { data, status } = useSession();
  const router = useRouter();

  const user = data?.user;

  return (
    <nav className="border-b">
      <div className="py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            keywar
          </Link>

          <div className="flex items-center space-x-4">
            {user && status === "authenticated" ? (
              <>
                <Button variant="ghost" size="sm">
                  Leaderboard
                </Button>
                <MenuDropdown user={user} />
              </>
            ) : (
              <>
                <Button
                  onClick={() => router.push("/signup")}
                  variant="ghost"
                  size="sm"
                >
                  Sign up
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  variant="primary"
                  size="sm"
                >
                  Log in
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
