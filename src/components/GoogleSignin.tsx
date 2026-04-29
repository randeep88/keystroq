"use client";

import { Button } from "@heroui/react";
import { signIn } from "next-auth/react";
import Image from "next/image";

const GoogleSignin = () => {
  return (
    <Button
      variant="tertiary"
      className="w-full"
      onClick={() => signIn("google", {redirectTo: "/"})}
    >
      <Image
        src={require("../../public/google.svg")}
        alt="Google"
        height={15}
        width={15}
      />
      Continue with Google
    </Button>
  );
};

export default GoogleSignin;
