# Data Fetching

## CRITICAL: Server Components Only

All data fetching in this app **MUST** be done exclusively via **React Server Components**.

**DO NOT** fetch data via:
- Route handlers (`app/api/`)
- Client components (`"use client"`)
- Any other mechanism

There are no exceptions to this rule.

## Database Queries

All database queries **MUST** go through helper functions located in the `/data` directory.

### Rules

1. **Use Drizzle ORM only.** Never write raw SQL. Always use the Drizzle query builder or ORM methods.
2. **Every query must be scoped to the authenticated user.** A logged-in user must only ever be able to access their own data. Always filter by the current user's ID.

### Example structure

```ts
// data/workouts.ts
import { db } from "@/lib/db";
import { workouts } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

Then in a Server Component:

```tsx
// app/dashboard/page.tsx
import { getWorkoutsForUser } from "@/data/workouts";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);

  return <div>{/* render workouts */}</div>;
}
```

### Why this matters

- Keeps data access logic centralized and testable.
- Prevents accidental data leaks between users — every query is explicitly scoped to a `userId`.
- Drizzle provides type-safety and prevents SQL injection by construction.
- Server Components keep secrets (DB credentials, auth tokens) out of the client bundle.
