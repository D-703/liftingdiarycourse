import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import { WorkoutForm } from "./workout-form";

interface EditWorkoutPageProps {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { workoutId } = await params;
  const workout = await getWorkoutById(userId, workoutId);

  if (!workout) notFound();

  return (
    <div className="container mx-auto max-w-lg px-4 pt-20 pb-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkoutForm workout={workout} />
        </CardContent>
      </Card>
    </div>
  );
}
