"use client"

import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/sidebar"
import { Users, Calendar, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface ApiResponse {
  count: number
  participants: Array<{
    id: number
    timestamp: string
    data: string
  }>
  status: string
}

export default function HomePage() {
  const [totalReservations, setTotalReservations] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/reservations")
        if (response.ok) {
          const data: ApiResponse = await response.json()
          setTotalReservations(data.count)
        }
      } catch (error) {
        console.error("[v0] Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const stats = [
    {
      title: "Total Reservations",
      value: loading ? "..." : totalReservations.toString(),
      icon: Users,
      description: "All time registrations",
      color: "text-blue-500",
    },
    {
      title: "Upcoming Trainings",
      value: "12",
      icon: Calendar,
      description: "Next 30 days",
      color: "text-purple-500",
    },
    {
      title: "Completed",
      value: "186",
      icon: CheckCircle,
      description: "This year",
      color: "text-green-500",
    },
    {
      title: "Pending",
      value: "24",
      icon: Clock,
      description: "Awaiting confirmation",
      color: "text-orange-500",
    },
  ]

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="container mx-auto p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to Training Portal</h1>
            <p className="text-muted-foreground">Overview of your training reservations and statistics</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Navigate to Reservations to view and manage all training reservations.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
