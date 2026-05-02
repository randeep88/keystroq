import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/arena",
  "/leaderboard",
  "/profile",
  "/result",
  "/start-war",
]);

const isAuthRoute = createRouteMatcher(["/login", "/sign-up"]);

export default clerkMiddleware(
  async (auth, req) => {
    const { userId } = await auth();

    console.log(userId);

    // already logged in hai aur auth route pe hai to redirect karo
    if (isAuthRoute(req) && userId) {
      return Response.redirect(new URL("/", req.url));
    }

    // protected route pe hai aur logged in nahi to login pe bhejo
    if (isProtectedRoute(req)) await auth.protect();
  },
  {
    signInUrl: "/login",
    signUpUrl: "/sign-up",
  },
);

// export default clerkMiddleware(
//   async (auth, req) => {
//     if (isProtectedRoute(req)) await auth.protect();
//   },
//   {
//     signInUrl: "/login",
//     signUpUrl: "/sign-up",
//   },
// );

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
