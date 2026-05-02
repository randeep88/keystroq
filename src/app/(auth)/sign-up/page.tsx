"use client";

import GoogleSignIn from "@/src/components/GoogleSignin";
import { useSignUp } from "@clerk/nextjs";
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

const SignUpPage = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const { signUp, fetchStatus } = useSignUp();

  const onSubmit = async (data: any) => {
    if (!data) return;

    try {
      const res = await signUp.password({
        emailAddress: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      });

      if (signUp.status === "missing_requirements") {
        console.log(signUp.requiredFields);
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log("session?.currentTask", session?.currentTask);
              return;
            }

            const url = decorateUrl("/");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      } else {
        console.error("Sign-up attempt not complete:", signUp);
      }

      if (res?.error) {
        toast.warning(res?.error?.message || "Failed to create account");
        console.log(signUp.status);
        return;
      }
    } catch (error: any) {
      toast(error?.errors?.[0]?.message || "Failed to create account");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-5 rounded-3xl space-y-5 flex flex-col items-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="bg-linear-to-r from-white to-accent bg-clip-text text-transparent text-5xl logo-font">
            keystroq
          </h1>
          <h1 className="text-xl text-center mb-5">Create an account</h1>
        </div>
        <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center gap-5">
            <TextField isRequired name="name" type="name">
              <Label>First Name</Label>
              <Input
                placeholder="John"
                variant="secondary"
                {...register("firstName")}
              />
              <FieldError />
            </TextField>
            <TextField isRequired name="name" type="name">
              <Label>Last Name</Label>
              <Input
                placeholder="Doe"
                variant="secondary"
                {...register("lastName")}
              />
              <FieldError />
            </TextField>
          </div>
          <TextField isRequired name="username" type="username">
            <Label>Username</Label>
            <Input
              placeholder="johndoe"
              variant="secondary"
              {...register("username")}
            />
            <FieldError />
          </TextField>
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
          <div id="clerk-captcha" />
          <div>
            <Button type="submit" className="w-full">
              {fetchStatus === "fetching" && (
                <Spinner color="current" size="sm" />
              )}{" "}
              Sign Up
            </Button>
            <div className="relative">
              <Separator className="my-4" variant="tertiary" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-muted z-10">
                or
              </span>
            </div>
            <GoogleSignIn />
          </div>
        </Form>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/login" className="underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
