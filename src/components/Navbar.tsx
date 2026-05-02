"use client";

import { Button } from "@heroui/react";
import MenuDropdown from "./MenuDropdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Show, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();
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
            <Show when="signed-in">
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
            </Show>
            <Show when="signed-out">
              <Button
                onClick={() => router.push("/sign-up")}
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
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
