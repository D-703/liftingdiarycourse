"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startedAt: z.coerce.date(),
  notes: z.string().optional(),
});

type CreateWorkoutParams = z.infer<typeof CreateWorkoutSchema>;

export async function createWorkoutAction(params: CreateWorkoutParams) {
  const { name, startedAt, notes } = CreateWorkoutSchema.parse(params);

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await createWorkout(userId, name, startedAt, notes);

  redirect("/dashboard");
}
