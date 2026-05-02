"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { Button, Input, toast } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

export default function SSOCallback() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const hasRun = useRef(false);

  const [showUsername, setShowUsername] = useState(false);
  const [username, setUsername] = useState("");

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        window.location.href = decorateUrl("/");
      },
    });
  };

  const finalizeSignUp = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        window.location.href = decorateUrl("/");
      },
    });
  };

  useEffect(() => {
    (async () => {
      if (!clerk.loaded || hasRun.current) return;
      hasRun.current = true;

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      if (signUp.status === "missing_requirements") {
        setShowUsername(true);
        return;
      }

      if (signUp.status === "complete") {
        await finalizeSignUp();
        return;
      }
    })();
  }, [clerk.loaded]);

  const handleUsernameSubmit = async () => {
    try {
      const trimmed = username.trim();

      if (!trimmed) {
        toast.warning("Username cannot be empty");
        return;
      }

      await signUp.update({ username: trimmed });

      await finalizeSignUp();
    } catch (err: any) {
      console.log(err);
      toast.warning(err?.errors?.[0]?.message);
    }
  };

  if (showUsername) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-sm text-white">
          Choose a username to complete signup
        </p>

        <Input
          placeholder="johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-80"
        />

        <Button onClick={handleUsernameSubmit} className="w-80">
          Continue
        </Button>

        <div id="clerk-captcha" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div id="clerk-captcha" />
      <p className="text-muted">Redirecting...</p>
    </div>
  );
}
