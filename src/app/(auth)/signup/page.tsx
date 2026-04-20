"use client";

import GoogleSignin from "@/src/components/GoogleSignin";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Separator,
  TextField,
} from "@heroui/react";
import axios from "axios";
import Image from "next/image";
import { useForm } from "react-hook-form";

const SignUpPage = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    if (!data) return;

    const res = await axios.post("http://localhost:4000/api/auth/signup", data);
    console.log("res.data", res.data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-5 rounded-3xl space-y-5 flex flex-col items-center">
        <div className="flex flex-col items-center gap-2">
          <Image src="/logo.png" alt="KeyClash" width={100} height={100} />
          <h1 className="text-3xl font-semibold">keywar</h1>
          <h1 className="text-xl text-muted mb-5 text-center">
            Create an account
          </h1>
        </div>
        <Form
          className="flex w-96 flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField isRequired name="name" type="name">
            <Label>Name</Label>
            <Input
              placeholder="John Doe"
              variant="secondary"
              {...register("name")}
            />
            <FieldError />
          </TextField>
          <TextField isRequired name="username" type="username">
            <Label>Username</Label>
            <Input
              placeholder="john"
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
          <div>
            <Button type="submit" className="w-full">
              Sign Up
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
          <a href="/login" className="underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
