"use client";

import { Button } from "@heroui/react";
import MenuDropdown from "./MenuDropdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../context/userContext";

const Navbar = () => {
  const { dbUser: user, isAuthenticated, isLoadingDbUser } = useUser();
  const router = useRouter();

  return (
    <nav className="border-b">
      <div className="py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="bg-linear-to-r from-white to-accent bg-clip-text text-transparent text-2xl logo-font"
          >
            keystroq
          </Link>

          <div className="flex items-center space-x-4">
            {user && isAuthenticated && !isLoadingDbUser ? (
              <>
                <Button
                  onClick={() => router.push("/")}
                  variant="ghost"
                  size="sm"
                >
                  Home
                </Button>
                <Button
                  onClick={() => router.push("/leaderboard")}
                  variant="ghost"
                  size="sm"
                >
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
