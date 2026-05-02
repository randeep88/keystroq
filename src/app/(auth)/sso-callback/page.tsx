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

      // Case 1: Existing signin complete
      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      // Case 2: Pehle se logged in user ka existing session
      if (signIn.existingSession || signUp.existingSession) {
        const sessionId =
          signIn.existingSession?.sessionId ||
          signUp.existingSession?.sessionId;
        if (sessionId) {
          await clerk.setActive({
            session: sessionId,
            navigate: ({ session, decorateUrl }) => {
              if (session?.currentTask) return;
              window.location.href = decorateUrl("/");
            },
          });
          return;
        }
      }

      // Case 3: Google email existing Clerk account se match kiya — signin me transfer
      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });

        await finalizeSignIn();
        return;
      }

      // Case 4: Naya user — username collect karo pehle
      if (signIn.isTransferable) {
        setShowUsername(true);
        return;
      }

      // Case 5: Already missing_requirements pe hai
      if (signUp.status === "missing_requirements") {
        setShowUsername(true);
        return;
      }

      // Case 6: Complete
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

      // transfer + username ek saath pass karo
      const { error } = await signUp.create({
        transfer: true,
        username: trimmed,
      });

      if (error) {
        toast.warning(error?.message);
        return;
      }

      if (signUp.status === "complete") {
        await finalizeSignUp();
      } else {
        toast.warning("Something went wrong: " + signUp.status);
      }
    } catch (err: any) {
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
