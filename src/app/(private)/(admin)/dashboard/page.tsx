'use client'

import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle  } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const hoursThisWeek = 22
  const weeklyTarget = 40
  const progress = (hoursThisWeek / weeklyTarget) * 100

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-0">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold">Good morning, John</h1>
        <p className="text-muted-foreground">{formattedDate}</p>
      </div>

      {/* Cards Container */}
      <div className="flex gap-x-6 gap-y-5 flex-wrap">
        {/* Today's Attendance */}
        <Card className="w-96 ">
          <CardHeader className="flex gap-x-2 text-left align-middle">
            <Clock />
            <CardTitle>Today&apos;s Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-left">
            <p className="text-lg font-medium text-red-500">Not Clocked In</p>
            <p className="text-sm text-muted-foreground">Shift: 9 AM – 6 PM</p>
            <Button className="mt-2 w-full">Clock In</Button>
          </CardContent>
        </Card>

        {/* Worked Hours Summary */}
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Worked Hours Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">Hours today:</span>
              <span className="font-medium">4h 30m</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">This week:</span>
              <span className="font-medium">{hoursThisWeek}h / {weeklyTarget}h</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col  space-y-2">
            <Button variant="outline">Request Leave</Button>
            <Button variant="outline">Attendance History</Button>
          </CardContent>
        </Card>

        {/* Upcoming Holidays */}
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Upcoming Holidays</CardTitle>
          </CardHeader>
          <CardContent className=" space-y-3">
            <HolidayItem name="Independence Day" date="Aug 26" daysLeft="5" />
            <HolidayItem name="Ganesh Chaturthi" date="Sep 2" daysLeft="12" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function HolidayItem({ name, date, daysLeft }: { name: string; date: string; daysLeft: string }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
      <span className="text-sm text-muted-foreground">{daysLeft} days</span>
    </div>
  )
}
