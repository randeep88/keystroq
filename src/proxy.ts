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

    if (isAuthRoute(req) && userId) {
      return Response.redirect(new URL("/", req.url));
    }

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
