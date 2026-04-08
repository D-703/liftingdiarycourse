"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { updateWorkout } from "@/data/workouts";

const UpdateWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  startedAt: z.coerce.date(),
  notes: z.string().optional(),
});

type UpdateWorkoutParams = z.infer<typeof UpdateWorkoutSchema>;

export async function updateWorkoutAction(params: UpdateWorkoutParams) {
  const { workoutId, name, startedAt, notes } = UpdateWorkoutSchema.parse(params);

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await updateWorkout(userId, workoutId, name, startedAt, notes);

  redirect("/dashboard");
}
