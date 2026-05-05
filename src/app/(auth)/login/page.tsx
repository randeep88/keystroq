"use client";

import GoogleSignin from "@/src/components/GoogleSignin";
import { useAuth, useSignIn } from "@clerk/nextjs";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Separator,
  Spinner,
  TextField,
  toast,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const { signIn, fetchStatus } = useSignIn();

  const onSubmit = async (data: any) => {
    try {
      const { error } = await signIn.password({
        emailAddress: data.email,
        password: data.password,
      });

      if (error) {
        toast.warning(error.message || "Login failed");
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            const url = decorateUrl("/");

            if (session?.currentTask) return;

            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      } else {
        console.error("Sign-in attempt not complete:", signIn);
      }
    } catch (err: any) {
      toast.warning(err?.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="md:p-5 p-2 rounded-3xl space-y-5 flex flex-col items-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="bg-linear-to-r from-white to-accent bg-clip-text text-transparent text-5xl logo-font">
            keystroq
          </h1>
          <h1 className="text-xl text-center">Login to continue</h1>
          <p className="text-sm mb-5 text-muted">
            Enter your credentials to access your account
          </p>
        </div>
        <Form
          className="flex md:w-96 w-full flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email</Label>
            <Input
              placeholder="john@example.com"
              variant="secondary"
              {...register("email")}
            />
            <FieldError />
          </TextField>
          <TextField
            isRequired
            minLength={8}
            name="password"
            type="text"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <Input
              placeholder="********"
              variant="secondary"
              {...register("password")}
            />
            <Description>
              Must be at least 8 characters with 1 uppercase and 1 number
            </Description>
            <FieldError />
          </TextField>
          <div>
            <Button type="submit" className="w-full">
              {fetchStatus === "fetching" && (
                <Spinner color="current" size="sm" />
              )}{" "}
              Login
            </Button>
            <div className="relative">
              <Separator className="my-4" variant="tertiary" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-muted z-10">
                or
              </span>
            </div>
            <GoogleSignin />
          </div>
        </Form>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/sign-up" className="underline font-semibold">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
