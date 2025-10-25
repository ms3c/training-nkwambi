"use client"

import { Sidebar } from "@/components/sidebar"
import { ReservationsTable } from "@/components/reservations-table"

export default function ReservationsPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background lg:ml-0">
        <div className="container mx-auto p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Training Reservations</h1>
            <p className="text-muted-foreground">View and manage all training reservations</p>
          </div>
          <ReservationsTable />
        </div>
      </main>
    </div>
  )
}
