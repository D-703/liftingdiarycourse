import { format } from "date-fns"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Dumbbell } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <div className="container mx-auto max-w-2xl px-4 pt-20 pb-8">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
        <Dumbbell className="size-6" />
        Workout Diary
      </h1>

      <div className="mb-6">
        <DatePicker selected={date} />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Workouts logged for {format(date, "do MMM yyyy")}
        </h2>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No workouts logged for this date.
            </CardContent>
          </Card>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{workout.name}</CardTitle>
                {workout.notes && (
                  <CardDescription>{workout.notes}</CardDescription>
                )}
                <CardDescription>
                  Started at {format(workout.startedAt, "h:mm a")}
                  {workout.completedAt && (
                    <> · Completed at {format(workout.completedAt, "h:mm a")}</>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
