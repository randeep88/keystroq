import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const protectedRoutes = [
    "/arena",
    "/leaderboard",
    "/profile",
    "/result",
    "/start-war",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: [
    "/arena/:path*",
    "/leaderboard/:path*",
    "/profile/:path*",
    "/result/:path*",
    "/start-war/:path*",
  ],
};
