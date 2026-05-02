"use client";

import { useSignIn } from "@clerk/nextjs";
import { Button } from "@heroui/react";
import Image from "next/image";

export default function GoogleSignIn() {
  const { signIn, fetchStatus } = useSignIn();

  const handleGoogle = async () => {
    if (fetchStatus === "fetching") return;
    try {
      console.log("Starting Google sign in...");
      const res = await signIn.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: "/",
      });

      console.log("res", res);
    } catch (err: any) {
      console.log("Google sign in error:", err?.errors?.[0]?.message);
    }
  };

  return (
    <Button className="w-full" variant="tertiary" onClick={handleGoogle}>
      <Image
        src={require("../../public/google.svg")}
        height={15}
        width={15}
        alt="google"
      />
      Continue with Google
    </Button>
  );
}
