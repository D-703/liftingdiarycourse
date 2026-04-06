import { format } from "date-fns"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Dumbbell, Plus } from "lucide-react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getWorkoutsForUser } from "@/data/workouts"
import { DatePicker } from "./date-picker"

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { date: dateParam } = await searchParams
  const date = dateParam
    ? (() => {
        const [year, month, day] = dateParam.split("-").map(Number)
        return new Date(year, month - 1, day)
      })()
    : new Date()

  const workouts = await getWorkoutsForUser(userId, date)

  return (
    <div className="container mx-auto max-w-2xl px-4 pt-10 pb-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600">
          <Dumbbell className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-zinc-800">Workout Diary</h1>
          <p className="text-xs text-zinc-500">Track your training progress</p>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">Select Date</p>
        <DatePicker selected={date} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-500">
            {format(date, "do MMM yyyy")}
          </h2>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href={`/dashboard/workout/new?date=${format(date, "yyyy-MM-dd")}`}>
              <Plus className="size-4" />
              Log Workout
            </Link>
          </Button>
        </div>

        {workouts.length === 0 ? (
          <Card className="border-zinc-200 bg-white">
            <CardContent className="py-12 text-center">
              <Dumbbell className="mx-auto mb-3 size-8 text-zinc-300" />
              <p className="text-sm text-zinc-500">No workouts logged for this date.</p>
              <p className="mt-1 text-xs text-zinc-400">Hit "Log Workout" to get started.</p>
            </CardContent>
          </Card>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id} className="border-zinc-200 bg-white transition-colors hover:border-zinc-300">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-md bg-blue-600/20">
                      <Dumbbell className="size-4 text-blue-400" />
                    </div>
                    <CardTitle className="text-base text-zinc-800">{workout.name}</CardTitle>
                  </div>
                  <span className="text-xs text-zinc-500 shrink-0">
                    {format(workout.startedAt, "h:mm a")}
                    {workout.completedAt && (
                      <> – {format(workout.completedAt, "h:mm a")}</>
                    )}
                  </span>
                </div>
                {workout.notes && (
                  <CardDescription className="mt-2 pl-10 text-zinc-500">{workout.notes}</CardDescription>
                )}
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
