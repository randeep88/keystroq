"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { Button, Input, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SSOCallback() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  const [showUsername, setShowUsername] = useState(false);
  const [username, setUsername] = useState("");

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        const url = decorateUrl("/");
        window.location.href = url.startsWith("http")
          ? url
          : window.location.origin + url;
      },
    });
  };

  const finalizeSignUp = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        const url = decorateUrl("/");
        window.location.href = url.startsWith("http")
          ? url
          : window.location.origin + url;
      },
    });
  };

  useEffect(() => {
    (async () => {
      if (!clerk.loaded || hasRun.current) return;
      hasRun.current = true;

      // Case 1: Normal signin complete
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
              const url = decorateUrl("/");
              window.location.href = url.startsWith("http")
                ? url
                : window.location.origin + url;
            },
          });
          return;
        }
      }

      // Case 3: Google email existing Clerk account se match kiya
      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });

        await finalizeSignIn();
        router.push("/login");
        return;
      }

      // Case 4: Naya user — signup me transfer karo
      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if (signUp.status === "complete") {
          await finalizeSignUp();
          return;
        }
        if (signUp.status === "missing_requirements") {
          setShowUsername(true);
          return;
        }
      }

      // Case 5: SignUp already missing_requirements pe hai
      if (signUp.status === "missing_requirements") {
        setShowUsername(true);
        return;
      }

      // Case 6: SignUp complete
      if (signUp.status === "complete") {
        await finalizeSignUp();
        return;
      }
    })();
  }, [clerk.loaded]);

  const handleUsernameSubmit = async () => {
    try {
      console.log("username:", username.trim().toString());
      if (!username.trim()) {
        toast.warning("Username cannot be empty");
        return;
      }

      await signUp.update({
        username: username.trim().toString(),
      });
      console.log("signUp.status:", signUp.status);

      if (signUp.status === "missing_requirements") {
        console.log("error message:", signUp.status);
        toast.warning(signUp.status);
        return;
      }

      if (signUp.status === "complete") {
        await finalizeSignUp();
      }
    } catch (err: any) {
      console.log("full error:", err);
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
