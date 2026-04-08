"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateWorkoutAction } from "./actions";
import type { Workout } from "@/db/schema";

interface WorkoutFormProps {
  workout: Workout;
}

export function WorkoutForm({ workout }: WorkoutFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const startedAt = (form.elements.namedItem("startedAt") as HTMLInputElement).value;
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value;

    try {
      await updateWorkoutAction({
        workoutId: workout.id,
        name,
        startedAt: new Date(startedAt),
        notes: notes || undefined,
      });
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      setPending(false);
    }
  }

  const defaultStartedAt = new Date(
    workout.startedAt.getTime() - workout.startedAt.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Workout Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Push Day, Leg Day"
          defaultValue={workout.name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startedAt">Start Time</Label>
        <Input
          id="startedAt"
          name="startedAt"
          type="datetime-local"
          defaultValue={defaultStartedAt}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Any notes about this workout..."
          defaultValue={workout.notes ?? ""}
          rows={3}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={pending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
