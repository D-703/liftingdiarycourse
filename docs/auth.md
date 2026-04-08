# Authentication

## Provider: Clerk

This app uses **Clerk** for all authentication. Do not implement custom auth, session management, or use any other auth library.

## Getting the Current User

Always use Clerk's `auth()` helper from `@clerk/nextjs/server` to get the authenticated user's ID in Server Components and server-side code.

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
```

**Never** use `currentUser()` when you only need the `userId` — `auth()` is lighter and sufficient for authorization purposes.

## Protecting Pages

Use Clerk middleware to protect routes. Configure `clerkMiddleware` in `middleware.ts` at the project root to specify which routes require authentication.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/workout(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

## Rules

1. **All protected pages must call `auth.protect()` via middleware** or manually redirect if `userId` is null — never assume the user is authenticated.
2. **Never trust client-supplied user IDs.** Always derive the `userId` from `auth()` server-side. Never accept a `userId` from query params, request bodies, or cookies.
3. **Scope all data queries to the authenticated `userId`.** See `data-fetching.md` for details.
4. **Do not use Clerk's `currentUser()` for authorization checks** — use `auth()` instead. `currentUser()` makes a network request and should only be used when you need full user profile data (name, email, etc.).

## Usage in Server Components

```tsx
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // proceed with userId for data fetching
}
```

## Clerk Components

Use Clerk's pre-built UI components for sign-in/sign-up flows:

```tsx
import { SignIn, SignUp, UserButton } from "@clerk/nextjs";
```

Do not build custom sign-in/sign-up forms.

## Environment Variables

Clerk requires the following environment variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

These must be present in `.env.local` for local development and set in the deployment environment for production. Never commit these values to source control.
