"use server";

import { db } from "@/db/Index";
import { workouts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, gte, lt } from "drizzle-orm";

export async function getWorkoutsForDate(date: string) {
  const { userId } = await auth();
  if (!userId) return [];

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
