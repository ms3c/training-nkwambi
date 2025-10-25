"use client"

import { useState, useEffect } from "react"
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ParticipantData {
  first_name: string
  middle_name: string
  last_name: string
  id_number: string
  date_of_birth: string
  sex: string
  document_type: string
  country_of_issue: string
}

interface Participant {
  id: number
  timestamp: string
  data: string
}

interface ApiResponse {
  count: number
  participants: Participant[]
  status: string
}

interface Reservation {
  id: number
  name: string
  idNumber: string
  idType: string
  reservedAt: string
  dateOfBirth: string
  sex: string
  countryOfIssue: string
}

const ITEMS_PER_PAGE = 8

const mapDocumentType = (docType: string): string => {
  const typeMap: Record<string, string> = {
    DRIVER_LICENSE: "Driver",
    VOTER_ID: "Voters",
    NIDA: "NIDA",
    PASSPORT: "Passport",
  }
  return typeMap[docType] || docType
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ReservationsTable() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/reservations")

        if (!response.ok) {
          throw new Error("Failed to fetch reservations")
        }

        const data: ApiResponse = await response.json()

        // Parse and transform the data
        const transformedData: Reservation[] = data.participants.map((participant) => {
          const parsedData: ParticipantData = JSON.parse(participant.data)

          return {
            id: participant.id,
            name: `${parsedData.first_name} ${parsedData.middle_name} ${parsedData.last_name}`,
            idNumber: parsedData.id_number,
            idType: mapDocumentType(parsedData.document_type),
            reservedAt: formatTimestamp(participant.timestamp),
            dateOfBirth: parsedData.date_of_birth,
            sex: parsedData.sex,
            countryOfIssue: parsedData.country_of_issue,
          }
        })

        setReservations(transformedData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("[v0] Error fetching reservations:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const totalPages = Math.ceil(reservations.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentReservations = reservations.slice(startIndex, endIndex)

  const handleViewDetails = (id: number) => {
    const reservation = reservations.find((r) => r.id === id)
    if (reservation) {
      setSelectedReservation(reservation)
      setIsDialogOpen(true)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservations List</CardTitle>
          <CardDescription>Loading reservations...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservations List</CardTitle>
          <CardDescription>Error loading reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-destructive">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Reservations List</CardTitle>
          <CardDescription>Total {reservations.length} reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID Number</TableHead>
                  <TableHead>ID Type</TableHead>
                  <TableHead>Reserved At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.name}</TableCell>
                    <TableCell className="font-mono text-sm">{reservation.idNumber}</TableCell>
                    <TableCell>{reservation.idType}</TableCell>
                    <TableCell className="text-muted-foreground">{reservation.reservedAt}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(reservation.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, reservations.length)} of {reservations.length}{" "}
              reservations
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-9"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>Complete information for this reservation</DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base font-semibold">{selectedReservation.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sex</p>
                  <p className="text-base">{selectedReservation.sex}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Type</p>
                  <p className="text-base">{selectedReservation.idType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Number</p>
                  <p className="text-base font-mono">{selectedReservation.idNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p className="text-base">{selectedReservation.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Country of Issue</p>
                  <p className="text-base">{selectedReservation.countryOfIssue}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Reserved At</p>
                <p className="text-base">{selectedReservation.reservedAt}</p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
