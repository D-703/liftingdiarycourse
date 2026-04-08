# Data Mutations

## CRITICAL: Server Actions Only

All data mutations in this app **MUST** be done exclusively via **Next.js Server Actions**.

**DO NOT** mutate data via:
- Route handlers (`app/api/`)
- Client-side fetch/axios calls
- Any other mechanism

There are no exceptions to this rule.

## File Colocation

Server actions **MUST** be defined in a colocated `actions.ts` file, placed alongside the page or feature they belong to.

```
app/
  workouts/
    page.tsx
    actions.ts       ✅ correct — colocated with the feature
```

Do **NOT** put server actions in:
- Generic shared files (e.g. `lib/actions.ts`)
- Page or component files directly
- The `/data` directory (that is for read helpers only)

## Database Access

All database writes **MUST** go through helper functions located in the `/data` directory. Server actions must never call `db` directly.

### Rules

1. **Use Drizzle ORM only.** Never write raw SQL. Always use the Drizzle query builder or ORM methods.
2. **Every mutation must be scoped to the authenticated user.** Always resolve the current user's session inside the server action and pass the `userId` to the data helper — never trust a `userId` coming from the client.

### Example structure

```ts
// data/workouts.ts
import { db } from "@/lib/db";
import { workouts } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function createWorkout(userId: string, name: string, date: Date) {
  return db.insert(workouts).values({ userId, name, date });
}

export async function deleteWorkout(userId: string, workoutId: string) {
  return db
    .delete(workouts)
    .where(eq(workouts.id, workoutId) && eq(workouts.userId, userId));
}
```

## Typed Parameters

Server action parameters **MUST** be typed with explicit TypeScript types.

**DO NOT** use `FormData` as a parameter type. Extract structured data on the client before calling the action.

```ts
// ✅ correct
export async function createWorkout(params: CreateWorkoutParams) { ... }

// ❌ wrong — FormData is not permitted
export async function createWorkout(formData: FormData) { ... }
```

## Zod Validation

**ALL** server actions **MUST** validate their arguments with [Zod](https://zod.dev) before doing anything else. Never trust input — even from typed client calls.

Define a Zod schema at the top of the action and call `.parse()` (throws on invalid input) or `.safeParse()` (returns a result object) before proceeding.

### Example

```ts
// app/workouts/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
});

type CreateWorkoutParams = z.infer<typeof CreateWorkoutSchema>;

export async function createWorkoutAction(params: CreateWorkoutParams) {
  const { name, date } = CreateWorkoutSchema.parse(params);

  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await createWorkout(session.user.id, name, date);
}
```

## Summary of Rules

| Rule | Requirement |
|------|-------------|
| Mutation mechanism | Server Actions only |
| File location | Colocated `actions.ts` |
| Database access | Via `/data` helper functions only |
| ORM | Drizzle only — no raw SQL |
| User scoping | Always resolved server-side from the session |
| Parameter types | Explicit TypeScript types — no `FormData` |
| Input validation | Zod on every server action, before any other logic |
