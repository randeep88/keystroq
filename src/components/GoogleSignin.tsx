"use client";

import { Button } from "@heroui/react";
import { signIn } from "next-auth/react";

const GoogleSignin = () => {
  return (
    <Button
      variant="tertiary"
      className="w-full"
      onClick={() => signIn("google")}
    >
      Continue with Google
    </Button>
  );
};

export default GoogleSignin;
