import { db } from "@/db/Index";
import { workouts } from "@/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

export async function createWorkout(
  userId: string,
  name: string,
  startedAt: Date,
  notes?: string
) {
  return db.insert(workouts).values({ userId, name, startedAt, notes });
}

export async function getWorkoutById(userId: string, workoutId: string) {
  const result = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .limit(1);
  return result[0] ?? null;
}

export async function updateWorkout(
  userId: string,
  workoutId: string,
  name: string,
  startedAt: Date,
  notes?: string
) {
  return db
    .update(workouts)
    .set({ name, startedAt, notes: notes ?? null })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}

export async function getWorkoutsForUser(userId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, start),
        lt(workouts.startedAt, end)
      )
    )
    .orderBy(workouts.startedAt);
}
